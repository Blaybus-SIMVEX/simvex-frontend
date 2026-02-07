const fs = require('fs');
const path = require('path');

// --- Helper Functions ---

function parseGLB(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const magic = buffer.toString('ascii', 0, 4);
    if (magic !== 'glTF') return null;
    
    // Read JSON chunk
    const chunk0Length = buffer.readUInt32LE(12);
    const chunk0Type = buffer.readUInt32LE(16);
    if (chunk0Type !== 0x4E4F534A) return null; // JSON
    
    const jsonData = buffer.toString('utf8', 20, 20 + chunk0Length);
    const gltf = JSON.parse(jsonData);
    
    // We also need the binary buffer to count vertices
    // The second chunk is usually BIN
    let binBuffer = null;
    if (buffer.length > 20 + chunk0Length) {
        const chunk1Offset = 20 + chunk0Length;
        const chunk1Length = buffer.readUInt32LE(chunk1Offset);
        const chunk1Type = buffer.readUInt32LE(chunk1Offset + 4);
        if (chunk1Type === 0x004E4942) { // BIN
            binBuffer = buffer.subarray(chunk1Offset + 8, chunk1Offset + 8 + chunk1Length);
        }
    }
    
    return { json: gltf, bin: binBuffer };
  } catch (e) {
    console.error(`Error parsing ${filePath}:`, e);
    return null;
  }
}

// Calculate total vertex count for a mesh or a node
function getVertexCount(gltf, nodeIndex) {
    const node = gltf.json.nodes[nodeIndex];
    if (!node) return 0;
    
    // If node has a mesh, count its vertices
    if (node.mesh !== undefined) {
        const mesh = gltf.json.meshes[node.mesh];
        return getMeshVertexCount(gltf, mesh);
    }
    
    // Logic for children? For now, we assume leaf matching relies on mesh
    return 0;
}

function getMeshVertexCount(gltf, mesh) {
    let count = 0;
    mesh.primitives.forEach(prim => {
        if (prim.attributes.POSITION !== undefined) {
            const accessor = gltf.json.accessors[prim.attributes.POSITION];
            if (accessor) {
                count += accessor.count;
            }
        }
    });
    return count;
}

// Get total vertex count of an entire GLTF (for Part GLBs)
function getTotalVertexCount(gltf) {
    let count = 0;
    (gltf.json.meshes || []).forEach(mesh => {
        count += getMeshVertexCount(gltf, mesh);
    });
    return count;
}


// --- Main Script ---

const modelDirName = process.argv[2];
if (!modelDirName) {
  console.error('Usage: node generate-assembly-config.js <ModelDirectoryName>');
  process.exit(1);
}

const baseDir = path.join(__dirname, '../public/models');
const modelDir = path.join(baseDir, modelDirName);

if (!fs.existsSync(modelDir)) {
  console.error(`Directory not found: ${modelDir}`);
  process.exit(1);
}

// 1. Identify Master GLB and Part GLBs
const allFiles = fs.readdirSync(modelDir).filter(f => f.endsWith('.glb'));
let masterFile = null;
const partFiles = [];

// Heuristic: "folderName.glb" or "drone.glb" or "assembly.glb" is master
// Or the largest file.
const explicitMasterNames = [
    `${modelDirName.toLowerCase()}.glb`,
    'drone.glb',
    'assembly.glb',
    'main.glb',
    'master.glb'
];

// Try exact match first
for (const name of explicitMasterNames) {
    if (allFiles.includes(name)) {
        masterFile = name;
        break;
    }
}

// Fallback: Largest file
if (!masterFile) {
    const sorted = allFiles.map(f => ({
        name: f,
        size: fs.statSync(path.join(modelDir, f)).size
    })).sort((a, b) => b.size - a.size);
    
    if (sorted.length > 0) {
        masterFile = sorted[0].name;
    }
}

if (!masterFile) {
    console.error("Could not determine Master GLB file.");
    process.exit(1);
}

// The rest are potential parts
allFiles.forEach(f => {
    if (f !== masterFile) partFiles.push(f);
});

console.log(`Target Model Directory: ${modelDirName}`);
console.log(`Master GLB: ${masterFile}`);
console.log(`Potential Parts: ${partFiles.length} files`);

// 2. Analyze Part GLBs to get signatures (Vertex Counts)
const partSignatures = [];
console.log('\nAnalyzing part files...');
partFiles.forEach(f => {
    const data = parseGLB(path.join(modelDir, f));
    if (data) {
        const vCount = getTotalVertexCount(data);
        if (vCount > 0) {
            partSignatures.push({
                fileName: f,
                displayName: f.replace('.glb', ''), // Human readable name
                vertexCount: vCount
            });
            // console.log(`  - ${f}: ${vCount} vertices`);
        }
    }
});


// 3. Analyze Master GLB Nodes
console.log('\nAnalyzing master file...');
const masterData = parseGLB(path.join(modelDir, masterFile));
if (!masterData) {
    console.error("Failed to parse master file");
    process.exit(1);
}

const nodes = masterData.json.nodes || [];
const finalParts = [];

nodes.forEach((node, index) => {
    if (!node.name) return;
    
    // Must have a mesh to be a visible part
    if (node.mesh === undefined) return;
    
    // Calculate this node's vertex count
    const vCount = getVertexCount(masterData, index);
    if (vCount === 0) return;
    
    // Try to match with a part file
    const matchedPart = partSignatures.find(p => p.vertexCount === vCount);
    
    const partEntry = {
        nodeName: node.name,
        displayName: matchedPart ? matchedPart.displayName : node.name, // Use matched name or fallback to node name
        originalPosition: node.translation || [0, 0, 0],
        originalRotation: node.rotation || [0, 0, 0, 1],
        originalScale: node.scale || [1, 1, 1]
    };

    if (matchedPart) {
        console.log(`  MATCH: Node "${node.name}" (${vCount}v) -> "${matchedPart.displayName}"`);
    } else {
        // console.log(`  No match for Node "${node.name}" (${vCount}v)`);
    }
    
    finalParts.push(partEntry);
});

// 4. Generate Config
const config = {
  modelFile: masterFile,
  parts: finalParts
};

const outputPath = path.join(modelDir, 'config.json');

// Preserve manual edits if config exists? 
// User asked to regenerate, so maybe overwrite is better, 
// BUT we should respect if they manually renamed "Solid1" to "Custom Name" if we couldn't match it.
// Let's simpler: overlap with existing names if we failed to match.

if (fs.existsSync(outputPath)) {
    try {
        const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        const nameMap = new Map();
        existing.parts.forEach(p => nameMap.set(p.nodeName, p.displayName));
        
        finalParts.forEach(p => {
            // Only use existing name if we DIDN'T find a match from part files
            // OR if the existing name is different from the node name (implies manual edit)
            // Actually, if we found a match (e.g. "Arm Gear"), we prefer that over "Solid1".
            // But if the user manually typed "Super Arm", we want to keep that.
            
            const existingName = nameMap.get(p.nodeName);
            const isMatched = partSignatures.some(s => s.displayName === p.displayName);
            
            if (existingName && existingName !== p.nodeName && !isMatched) {
                 p.displayName = existingName;
            }
        });
    } catch(e) {}
}

fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
console.log(`\n✅ Generated config.json with ${finalParts.length} parts.`);
