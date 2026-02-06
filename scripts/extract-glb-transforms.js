const fs = require('fs');
const path = require('path');

// GLB 파일 파싱을 위한 간단한 스크립트
// GLB는 바이너리 glTF 형식으로, JSON 청크와 바이너리 청크로 구성됨

function parseGLB(filePath) {
  const buffer = fs.readFileSync(filePath);
  
  // GLB 헤더 (12바이트)
  const magic = buffer.toString('ascii', 0, 4);
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  
  console.log(`Magic: ${magic}, Version: ${version}, Length: ${length}`);
  
  if (magic !== 'glTF') {
    console.error('Not a valid GLB file');
    return null;
  }
  
  // 첫 번째 청크 (JSON)
  const chunk0Length = buffer.readUInt32LE(12);
  const chunk0Type = buffer.readUInt32LE(16);
  
  if (chunk0Type === 0x4E4F534A) { // 'JSON' in little-endian
    const jsonData = buffer.toString('utf8', 20, 20 + chunk0Length);
    return JSON.parse(jsonData);
  }
  
  return null;
}

function extractNodeTransforms(gltf) {
  const nodes = gltf.nodes || [];
  const result = [];
  
  nodes.forEach((node, index) => {
    const info = {
      index,
      name: node.name || `Node_${index}`,
      translation: node.translation || [0, 0, 0],
      rotation: node.rotation || [0, 0, 0, 1],
      scale: node.scale || [1, 1, 1],
      children: node.children || []
    };
    result.push(info);
  });
  
  return result;
}

// 드론 GLB 파일 분석
const dronePath = path.join(__dirname, '../public/models/Drone/drone.glb');
const gltf = parseGLB(dronePath);

if (gltf) {
  console.log('\n=== Scene Structure ===');
  console.log('Scenes:', gltf.scenes?.length);
  console.log('Nodes:', gltf.nodes?.length);
  console.log('Meshes:', gltf.meshes?.length);
  
  console.log('\n=== Node Transforms ===');
  const transforms = extractNodeTransforms(gltf);
  transforms.forEach(node => {
    console.log(`\n[${node.index}] ${node.name}`);
    console.log(`  Translation: [${node.translation.map(v => v.toFixed(4)).join(', ')}]`);
    console.log(`  Rotation: [${node.rotation.map(v => v.toFixed(4)).join(', ')}]`);
    console.log(`  Scale: [${node.scale.map(v => v.toFixed(4)).join(', ')}]`);
    if (node.children.length > 0) {
      console.log(`  Children: [${node.children.join(', ')}]`);
    }
  });
  
  // JSON 형태로도 출력
  console.log('\n\n=== JSON Export ===');
  console.log(JSON.stringify(transforms, null, 2));
}
