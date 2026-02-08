'use client';

import { TransformControls, useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { button, useControls } from 'leva';
import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

const MODEL_BASE_PATH = '/models/V4_Engine';

// 각 부품의 GLB 파일 경로
const PART_PATHS = {
  crankshaft: `${MODEL_BASE_PATH}/Crankshaft.glb`,
  piston: `${MODEL_BASE_PATH}/Piston.glb`,
  pistonRing: `${MODEL_BASE_PATH}/Piston Ring.glb`,
  pistonPin: `${MODEL_BASE_PATH}/Piston Pin.glb`,
  connectingRod: `${MODEL_BASE_PATH}/Connecting Rod.glb`,
  connectingRodCap: `${MODEL_BASE_PATH}/Connecting Rod Cap.glb`,
  conrodBolt: `${MODEL_BASE_PATH}/Conrod Bolt.glb`,
};

// 부품 이름 한글화
const PART_NAMES: Record<string, string> = {
  crankshaft: '크랭크샤프트',
  piston: '피스톤',
  pistonRing: '피스톤 링',
  pistonPin: '피스톤 핀',
  connectingRod: '커넥팅 로드',
  connectingRodCap: '커넥팅 로드 캡',
  conrodBolt: '볼트',
};

interface EditablePartProps {
  url: string;
  partKey: string;
  isSelected: boolean;
  onSelect: (partKey: string) => void;
  position: [number, number, number];
  rotation: [number, number, number];
  onTransformChange: (partKey: string, position: THREE.Vector3, rotation: THREE.Euler) => void;
}

// 편집 가능한 부품 컴포넌트
function EditablePart({
  url,
  partKey,
  isSelected,
  onSelect,
  position,
  rotation,
  onTransformChange,
}: EditablePartProps) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const [group, setGroup] = useState<THREE.Group | null>(null);

  // position/rotation prop이 변경되면 group에 적용
  useEffect(() => {
    if (group) {
      group.position.set(position[0], position[1], position[2]);
      group.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  }, [group, position, rotation]);

  // 하이라이트 효과 적용
  useMemo(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material.emissive) {
            if (isSelected) {
              material.emissive = new THREE.Color(0x00aaff);
              material.emissiveIntensity = 0.5;
            } else {
              material.emissive = new THREE.Color(0x000000);
              material.emissiveIntensity = 0;
            }
          }
        }
      }
    });
  }, [clonedScene, isSelected]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(partKey);
  };

  // TransformControls 드래그 시 실시간 상태 업데이트
  const handleTransformChange = () => {
    if (group) {
      onTransformChange(partKey, group.position.clone(), group.rotation.clone());
    }
  };

  return (
    <>
      <group ref={setGroup}>
        <primitive object={clonedScene} onClick={handleClick} />
      </group>
      {isSelected && group && <TransformControls object={group} mode="translate" onChange={handleTransformChange} />}
    </>
  );
}

// V4 엔진 조립 에디터
export function V4EngineAssemblyEditor() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate');

  // 각 부품의 위치/회전 상태
  const [partTransforms, setPartTransforms] = useState<
    Record<
      string,
      {
        position: [number, number, number];
        rotation: [number, number, number];
      }
    >
  >({
    crankshaft: { position: [0, 0, 0], rotation: [0, 0, 0] },
    piston: { position: [0, 0, 0], rotation: [0, 0, 0] },
    pistonRing: { position: [0, 0, 0], rotation: [0, 0, 0] },
    pistonPin: { position: [0, 0, 0], rotation: [0, 0, 0] },
    connectingRod: { position: [0, 0, 0], rotation: [0, 0, 0] },
    connectingRodCap: { position: [0, 0, 0], rotation: [0, 0, 0] },
    conrodBolt: { position: [0, 0, 0], rotation: [0, 0, 0] },
  });

  // Leva 컨트롤 - 선택된 부품 조정
  useControls('조립 에디터', {
    '선택된 부품': {
      value: selectedPart ? PART_NAMES[selectedPart] || selectedPart : '없음',
      editable: false,
    },
    '변환 모드': {
      value: transformMode,
      options: { 이동: 'translate', 회전: 'rotate' },
      onChange: (v) => setTransformMode(v as 'translate' | 'rotate'),
    },
    '좌표값 출력': button(() => {
      console.log('=== 현재 부품 좌표값 ===');
      Object.entries(partTransforms).forEach(([key, transform]) => {
        console.log(`${PART_NAMES[key]}:`, {
          position: transform.position.map((v) => v.toFixed(4)),
          rotation: transform.rotation.map((v) => ((v * 180) / Math.PI).toFixed(2) + '°'),
        });
      });
      console.log('=== JSON 형식 ===');
      console.log(JSON.stringify(partTransforms, null, 2));
    }),
  });

  // 선택된 부품의 Leva 컨트롤
  useControls(
    selectedPart ? `${PART_NAMES[selectedPart]} 위치` : '부품 선택 필요',
    selectedPart
      ? {
          posX: {
            value: partTransforms[selectedPart]?.position[0] || 0,
            step: 0.001,
            onChange: (v) => updatePartPosition(selectedPart, 0, v),
          },
          posY: {
            value: partTransforms[selectedPart]?.position[1] || 0,
            step: 0.001,
            onChange: (v) => updatePartPosition(selectedPart, 1, v),
          },
          posZ: {
            value: partTransforms[selectedPart]?.position[2] || 0,
            step: 0.001,
            onChange: (v) => updatePartPosition(selectedPart, 2, v),
          },
          rotX: {
            value: ((partTransforms[selectedPart]?.rotation[0] || 0) * 180) / Math.PI,
            min: -180,
            max: 180,
            step: 1,
            onChange: (v) => updatePartRotation(selectedPart, 0, (v * Math.PI) / 180),
          },
          rotY: {
            value: ((partTransforms[selectedPart]?.rotation[1] || 0) * 180) / Math.PI,
            min: -180,
            max: 180,
            step: 1,
            onChange: (v) => updatePartRotation(selectedPart, 1, (v * Math.PI) / 180),
          },
          rotZ: {
            value: ((partTransforms[selectedPart]?.rotation[2] || 0) * 180) / Math.PI,
            min: -180,
            max: 180,
            step: 1,
            onChange: (v) => updatePartRotation(selectedPart, 2, (v * Math.PI) / 180),
          },
        }
      : {},
    [selectedPart, partTransforms],
  );

  const updatePartPosition = (partKey: string, axis: number, value: number) => {
    setPartTransforms((prev) => {
      const newPos = [...prev[partKey].position] as [number, number, number];
      newPos[axis] = value;
      return {
        ...prev,
        [partKey]: { ...prev[partKey], position: newPos },
      };
    });
  };

  const updatePartRotation = (partKey: string, axis: number, value: number) => {
    setPartTransforms((prev) => {
      const newRot = [...prev[partKey].rotation] as [number, number, number];
      newRot[axis] = value;
      return {
        ...prev,
        [partKey]: { ...prev[partKey], rotation: newRot },
      };
    });
  };

  const handleTransformChange = (partKey: string, position: THREE.Vector3, rotation: THREE.Euler) => {
    setPartTransforms((prev) => ({
      ...prev,
      [partKey]: {
        position: [position.x, position.y, position.z],
        rotation: [rotation.x, rotation.y, rotation.z],
      },
    }));

    // 콘솔에 실시간 좌표 출력
    console.log(`${PART_NAMES[partKey]} 위치 변경:`, {
      position: [position.x.toFixed(4), position.y.toFixed(4), position.z.toFixed(4)],
      rotation: [
        ((rotation.x * 180) / Math.PI).toFixed(2) + '°',
        ((rotation.y * 180) / Math.PI).toFixed(2) + '°',
        ((rotation.z * 180) / Math.PI).toFixed(2) + '°',
      ],
    });
  };

  const handleSelect = (partKey: string) => {
    setSelectedPart((prev) => (prev === partKey ? null : partKey));
  };

  const handleBackgroundClick = () => {
    setSelectedPart(null);
  };

  return (
    <group onClick={handleBackgroundClick} scale={5}>
      {Object.entries(PART_PATHS).map(([key, url]) => (
        <EditablePart
          key={key}
          url={url}
          partKey={key}
          isSelected={selectedPart === key}
          onSelect={handleSelect}
          position={partTransforms[key].position}
          rotation={partTransforms[key].rotation}
          onTransformChange={handleTransformChange}
        />
      ))}
    </group>
  );
}

// GLB 파일 프리로드
Object.values(PART_PATHS).forEach((path) => {
  useGLTF.preload(path);
});
