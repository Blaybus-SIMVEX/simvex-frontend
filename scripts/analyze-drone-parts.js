const fs = require('fs');
const path = require('path');

function parseGLB(filePath) {
  const buffer = fs.readFileSync(filePath);
  const magic = buffer.toString('ascii', 0, 4);
  
  if (magic !== 'glTF') {
    console.error('Not a valid GLB file:', filePath);
    return null;
  }
  
  const chunk0Length = buffer.readUInt32LE(12);
  const jsonData = buffer.toString('utf8', 20, 20 + chunk0Length);
  return JSON.parse(jsonData);
}

const droneDir = path.join(__dirname, '../public/models/Drone');

// 모든 부품 파일 분석
const partFiles = [
  'Arm gear.glb',
  'Beater disc.glb',
  'Gearing.glb',
  'Impellar Blade.glb',
  'Leg.glb',
  'Main frame.glb',
  'Main frame_MIR.glb',
  'Nut.glb',
  'Screw.glb'
];

console.log('=== Part Files Analysis ===\n');

const partInfo = {};

partFiles.forEach(file => {
  const filePath = path.join(droneDir, file);
  const gltf = parseGLB(filePath);
  
  if (gltf) {
    // 첫 번째 메쉬의 primitive 수와 정점 수 추출
    const meshes = gltf.meshes || [];
    const nodes = gltf.nodes || [];
    
    const meshPrimitives = meshes.map(m => m.primitives?.length || 0);
    
    // 파일 이름에서 부품명 추출
    const partName = file.replace('.glb', '');
    
    console.log(`📦 ${partName}`);
    console.log(`   Nodes: ${nodes.length}, Meshes: ${meshes.length}`);
    
    if (nodes.length > 0 && nodes[0].translation) {
      console.log(`   Base translation: [${nodes[0].translation.map(v => v.toFixed(4)).join(', ')}]`);
    }
    
    partInfo[partName] = {
      fileName: file,
      nodeCount: nodes.length,
      meshCount: meshes.length,
      nodes: nodes.map((n, i) => ({
        index: i,
        name: n.name || `Node_${i}`,
        translation: n.translation || [0, 0, 0],
        rotation: n.rotation || [0, 0, 0, 1],
        scale: n.scale || [1, 1, 1]
      }))
    };
    console.log('');
  }
});

// JSON 형태로 저장
const outputPath = path.join(__dirname, 'drone-parts-info.json');
fs.writeFileSync(outputPath, JSON.stringify(partInfo, null, 2));
console.log('\n✅ Saved to:', outputPath);

// 완제품 분석
console.log('\n\n=== Complete Drone Analysis ===\n');
const droneGltf = parseGLB(path.join(droneDir, 'drone.glb'));

if (droneGltf) {
  const nodes = droneGltf.nodes || [];
  const meshes = droneGltf.meshes || [];
  
  console.log(`Total Nodes: ${nodes.length}`);
  console.log(`Total Meshes: ${meshes.length}`);
  
  // 메쉬 이름과 노드 이름 출력
  console.log('\nMesh names:');
  meshes.forEach((m, i) => {
    console.log(`  [${i}] ${m.name || 'unnamed'}`);
  });
  
  console.log('\nNode-Mesh mapping:');
  nodes.forEach((n, i) => {
    if (n.mesh !== undefined) {
      const meshName = meshes[n.mesh]?.name || 'unnamed';
      console.log(`  Node[${i}] "${n.name}" -> Mesh[${n.mesh}] "${meshName}"`);
    }
  });
}
