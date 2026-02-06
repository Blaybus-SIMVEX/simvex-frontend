const fs = require('fs');
const path = require('path');

function parseGLB(filePath) {
  const buffer = fs.readFileSync(filePath);
  const magic = buffer.toString('ascii', 0, 4);
  if (magic !== 'glTF') return null;
  const chunk0Length = buffer.readUInt32LE(12);
  const jsonData = buffer.toString('utf8', 20, 20 + chunk0Length);
  return JSON.parse(jsonData);
}

// 쿼터니언을 오일러 각도(라디안)로 변환
function quaternionToEuler(q) {
  const [x, y, z, w] = q;
  
  // Roll (x-axis rotation)
  const sinr_cosp = 2 * (w * x + y * z);
  const cosr_cosp = 1 - 2 * (x * x + y * y);
  const roll = Math.atan2(sinr_cosp, cosr_cosp);

  // Pitch (y-axis rotation)
  const sinp = 2 * (w * y - z * x);
  let pitch;
  if (Math.abs(sinp) >= 1)
    pitch = Math.PI / 2 * Math.sign(sinp);
  else
    pitch = Math.asin(sinp);

  // Yaw (z-axis rotation)
  const siny_cosp = 2 * (w * z + x * y);
  const cosy_cosp = 1 - 2 * (y * y + z * z);
  const yaw = Math.atan2(siny_cosp, cosy_cosp);

  return [roll, pitch, yaw];
}

const droneDir = path.join(__dirname, '../public/models/Drone');
const droneGltf = parseGLB(path.join(droneDir, 'drone.glb'));

if (!droneGltf) {
  console.error('Failed to parse drone.glb');
  process.exit(1);
}

// 각 부품 GLB 분석
const partFiles = {
  'Main frame': 'Main frame.glb',
  'Main frame_MIR': 'Main frame_MIR.glb',
  'Arm gear': 'Arm gear.glb',
  'Beater disc': 'Beater disc.glb',
  'Gearing': 'Gearing.glb',
  'Impellar Blade': 'Impellar Blade.glb',
  'Leg': 'Leg.glb',
  'Nut': 'Nut.glb',
  'Screw': 'Screw.glb'
};

// 각 부품의 메쉬 정점 수 계산
function getMeshVertexCount(gltf) {
  const meshes = gltf.meshes || [];
  let totalVertices = 0;
  meshes.forEach(mesh => {
    mesh.primitives?.forEach(prim => {
      if (prim.attributes?.POSITION !== undefined) {
        const accessor = gltf.accessors?.[prim.attributes.POSITION];
        if (accessor) {
          totalVertices += accessor.count;
        }
      }
    });
  });
  return totalVertices;
}

// 각 부품의 정점 수 수집
const partVertexCounts = {};
Object.entries(partFiles).forEach(([name, file]) => {
  const gltf = parseGLB(path.join(droneDir, file));
  if (gltf) {
    partVertexCounts[name] = getMeshVertexCount(gltf);
  }
});

console.log('Part vertex counts:', partVertexCounts);

// 완제품의 각 메쉬 정점 수
const droneNodes = droneGltf.nodes || [];
const droneMeshes = droneGltf.meshes || [];

const droneNodeInfo = droneNodes.map((node, i) => {
  let vertexCount = 0;
  if (node.mesh !== undefined) {
    const mesh = droneMeshes[node.mesh];
    mesh?.primitives?.forEach(prim => {
      if (prim.attributes?.POSITION !== undefined) {
        const accessor = droneGltf.accessors?.[prim.attributes.POSITION];
        if (accessor) {
          vertexCount += accessor.count;
        }
      }
    });
  }
  
  const euler = node.rotation ? quaternionToEuler(node.rotation) : [0, 0, 0];
  
  return {
    index: i,
    name: node.name,
    translation: node.translation || [0, 0, 0],
    rotation: node.rotation || [0, 0, 0, 1],
    eulerRotation: euler,
    scale: node.scale || [1, 1, 1],
    vertexCount
  };
});

// 부품 매핑 시도, 정점 수로 매칭
console.log('\n=== Node to Part Mapping ===\n');

const partIdentification = {};

droneNodeInfo.forEach(nodeInfo => {
  let matchedPart = 'unknown';
  
  // 정점 수로 부품 식별
  for (const [partName, vertCount] of Object.entries(partVertexCounts)) {
    if (nodeInfo.vertexCount === vertCount) {
      matchedPart = partName;
      break;
    }
  }
  
  if (!partIdentification[matchedPart]) {
    partIdentification[matchedPart] = [];
  }
  
  partIdentification[matchedPart].push({
    nodeIndex: nodeInfo.index,
    nodeName: nodeInfo.name,
    position: nodeInfo.translation,
    rotation: nodeInfo.rotation,
    euler: nodeInfo.eulerRotation,
    scale: nodeInfo.scale
  });
  
  console.log(`[${nodeInfo.index}] ${nodeInfo.name} (${nodeInfo.vertexCount} verts) -> ${matchedPart}`);
});

console.log('\n=== Parts Configuration for Code ===\n');

// 코드에서 사용할 수 있는 형태로 출력
Object.entries(partIdentification).forEach(([partName, instances]) => {
  console.log(`// ${partName} (${instances.length} instances)`);
  instances.forEach((inst, i) => {
    console.log(`// Instance ${i + 1}: pos=[${inst.position.map(v => v.toFixed(4)).join(', ')}], rot=[${inst.euler.map(v => v.toFixed(4)).join(', ')}]`);
  });
  console.log('');
});

// JSON으로 저장
const configOutput = {
  partIdentification,
  droneNodeInfo
};

fs.writeFileSync(
  path.join(__dirname, 'drone-assembly-config.json'),
  JSON.stringify(configOutput, null, 2)
);

console.log('\n✅ Saved configuration to drone-assembly-config.json');
