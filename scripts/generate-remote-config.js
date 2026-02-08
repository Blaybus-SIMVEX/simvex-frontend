/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');


// --- Helper Functions (Shared logic) ---

function parseGLBBuffer(buffer) {
  try {
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
    console.error(`Error parsing GLB buffer:`, e);
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

// Get total vertex count of an entire GLTF
function getTotalVertexCount(gltf) {
    let count = 0;
    (gltf.json.meshes || []).forEach(mesh => {
        count += getMeshVertexCount(gltf, mesh);
    });
    return count;
}

// --- Main Script ---

async function main() {
    const masterUrl = process.argv[2];
    const partUrls = process.argv.slice(3);

    if (!masterUrl) {
        console.error('Usage: node generate-remote-config.js <MasterGLB_URL> [PartGLB_URL_1] [PartGLB_URL_2] ...');
        process.exit(1);
    }

    console.log(`Fetching Master GLB: ${masterUrl}`);
    
    try {
        // Fetch Master GLB
        const masterRes = await fetch(masterUrl);
        if (!masterRes.ok) throw new Error(`Failed to fetch master GLB: ${masterRes.statusText}`);
        const masterArrayBuffer = await masterRes.arrayBuffer();
        const masterBuffer = Buffer.from(masterArrayBuffer);
        
        const masterData = parseGLBBuffer(masterBuffer);
        if (!masterData) {
            console.error("Failed to parse master GLB.");
            process.exit(1);
        }

        // Fetch and Analyze Parts (if any)
        const partSignatures = [];
        if (partUrls.length > 0) {
            console.log(`Fetching ${partUrls.length} part files...`);
            
            for (const url of partUrls) {
                try {
                    const partRes = await fetch(url);
                    if (!partRes.ok) {
                        console.warn(`Failed to fetch part ${url}: ${partRes.statusText}`);
                        continue;
                    }
                    const partBuf = Buffer.from(await partRes.arrayBuffer());
                    const partData = parseGLBBuffer(partBuf);
                    
                    if (partData) {
                        const vCount = getTotalVertexCount(partData);
                        // Extract filename from URL for display name
                        const fileName = url.split('/').pop().replace('.glb', '');
                        
                        partSignatures.push({
                            fileName: fileName,
                            displayName: decodeURIComponent(fileName), // Handle URL encoding
                            vertexCount: vCount
                        });
                    }
                } catch (e) {
                    console.warn(`Error processing part ${url}:`, e.message);
                }
            }
        }

        // Generate Config
        console.log('\nAnalyzing nodes...');
        const nodes = masterData.json.nodes || [];
        const finalParts = [];

        nodes.forEach((node, index) => {
            if (!node.name) return;
            if (node.mesh === undefined) return;
            
            const vCount = getVertexCount(masterData, index);
            if (vCount === 0) return;
            
            // Allow approximate matching if exact match fails? 
            // For now, stick to exact match to be safe.
            const matchedPart = partSignatures.find(p => p.vertexCount === vCount);
            
            const partEntry = {
                nodeName: node.name,
                displayName: matchedPart ? matchedPart.displayName : node.name,
                originalPosition: node.translation || [0, 0, 0],
                originalRotation: node.rotation || [0, 0, 0, 1],
                originalScale: node.scale || [1, 1, 1]
            };

            if (matchedPart) {
                console.log(`  MATCH: Node "${node.name}" (${vCount}v) -> "${matchedPart.displayName}"`);
            }
            
            finalParts.push(partEntry);
        });

        const config = {
            modelFile: masterUrl, // The URL itself becomes the identifier
            parts: finalParts
        };

        // Output to stdout or file
        // For simplicity, let's just print to stdout so user can pipe it
        console.log('\n--- CONFIG START ---');
        console.log(JSON.stringify(config, null, 2));
        console.log('--- CONFIG END ---');
        
        // Also save to a local file for convenience
        fs.writeFileSync('remote-config.json', JSON.stringify(config, null, 2));
        console.log('\n(Config also saved to remote-config.json for convenience)');

    } catch (error) {
        console.error("Fatal Error:", error);
        process.exit(1);
    }
}

main();
