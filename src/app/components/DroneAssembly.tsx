'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

const MODEL_BASE_PATH = '/models/Drone';

// 완제품 드론 GLB 파일 경로
const COMPLETE_DRONE_PATH = `${MODEL_BASE_PATH}/drone.glb`;

// 한글 부품명 매핑 (노드 인덱스 기반)
// 정점 수로 분류:
// 7141 = 암 기어 (4개: 0, 13, 17, 18)
// 3341 = 다리 (4개: 3, 11, 15, 20)
// 1232 = 프로펠러 (4개: 9, 10, 14, 21)
// 1213 = 기어링 (4개: 2, 12, 16, 19)
// 8073/8087 = 메인 프레임 (2개: 4, 5)
// 1832 = 비터 디스크 (1개: 1)
// 1152 = 너트 (1개: 6)
// 1400 = 나사 (1개: 7)
// 234 = 기타 (1개: 8)

const NODE_PART_MAPPING: Record<string, { type: string; index: number }> = {
  'Solid1': { type: 'armGear', index: 1 },
  'Solid1.001': { type: 'beaterDisc', index: 1 },
  'Solid1.002': { type: 'gearing', index: 1 },
  'Solid1.003': { type: 'impellarBlade', index: 2 },
  'Solid1.004': { type: 'leg', index: 1 },
  'Solid1.005': { type: 'mainFrame', index: 1 },
  'Solid1.006': { type: 'mainFrameMir', index: 1 },
  'Solid1.007': { type: 'nut', index: 1 },
  'Solid1.008': { type: 'screw', index: 1 },
  'Solid1.009': { type: 'other', index: 1 },
  'Solid1.010': { type: 'armGear', index: 4 },
  'Solid1.011': { type: 'leg', index: 2 },
  'Solid1.012': { type: 'gearing', index: 4 },
  'Solid1.013': { type: 'impellarBlade', index: 1 },
  'Solid1.014': { type: 'gearing', index: 2 },
  'Solid1.015': { type: 'armGear', index: 2 },
  'Solid1.016': { type: 'impellarBlade', index: 3 },
  'Solid1.017': { type: 'leg', index: 3 },
  'Solid1.018': { type: 'gearing', index: 3 },
  'Solid1.019': { type: 'armGear', index: 3 },
  'Solid1.020': { type: 'leg', index: 4 },
  'Solid1.021': { type: 'impellarBlade', index: 4 },
};

const PART_NAMES: Record<string, string> = {
  'mainFrame': '메인 프레임',
  'mainFrameMir': '메인 프레임 (미러)',
  'armGear': '암 기어',
  'leg': '다리',
  'impellarBlade': '프로펠러',
  'beaterDisc': '비터 디스크',
  'gearing': '기어링',
  'nut': '너트',
  'screw': '나사',
  'other': '기타',
};

export function getPartDisplayName(partType: string, index: number): string {
  const koreanName = PART_NAMES[partType] || partType;
  if (partType === 'mainFrame' || partType === 'mainFrameMir' || partType === 'beaterDisc' || 
      partType === 'nut' || partType === 'screw' || partType === 'other') {
    return koreanName;
  }
  return `${koreanName} ${index}`;
}

// 드론 전체 조립체 - 완제품 GLB 사용
interface DroneAssemblyProps {
  onSelectPart?: (partName: string | null, displayName: string | null) => void;
}

export function DroneAssembly({ onSelectPart }: DroneAssemblyProps) {
  const { scene } = useGLTF(COMPLETE_DRONE_PATH);
  const [selectedNodeName, setSelectedNodeName] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // 씬 복제 및 초기화
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // 모든 메시에 이름 저장
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData.originalName = child.parent?.name || child.name;
      }
    });
    
    return clone;
  }, [scene]);

  // 하이라이트 적용
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.MeshStandardMaterial;
        const nodeName = child.userData.originalName || child.parent?.name || child.name;
        
        if (material.emissive) {
          if (selectedNodeName && nodeName === selectedNodeName) {
            material.emissive = new THREE.Color(0x00aaff);
            material.emissiveIntensity = 0.5;
          } else {
            material.emissive = new THREE.Color(0x000000);
            material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [clonedScene, selectedNodeName]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    const mesh = e.object as THREE.Mesh;
    const nodeName = mesh.userData.originalName || mesh.parent?.name || mesh.name;
    
    console.log('Clicked node:', nodeName);
    
    if (nodeName === selectedNodeName) {
      setSelectedNodeName(null);
      if (onSelectPart) {
        onSelectPart(null, null);
      }
    } else {
      setSelectedNodeName(nodeName);
      
      const mapping = NODE_PART_MAPPING[nodeName];
      if (mapping && onSelectPart) {
        const displayName = getPartDisplayName(mapping.type, mapping.index);
        onSelectPart(`${mapping.type}-${mapping.index}`, displayName);
      }
    }
  };

  const handleBackgroundClick = () => {
    setSelectedNodeName(null);
    if (onSelectPart) {
      onSelectPart(null, null);
    }
  };

  return (
    <group ref={groupRef} onClick={handleBackgroundClick} scale={5} rotation={[0, 0, 0]}>
      <primitive
        object={clonedScene}
        position={[0, 0, 0]}
        onClick={handleClick}
      />
    </group>
  );
}

// GLB 파일 프리로드
useGLTF.preload(COMPLETE_DRONE_PATH);
