'use client';

import React, { useState, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls, folder } from 'leva';

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

// 부품 이름 한글 매핑
const PART_NAMES: { [key: string]: string } = {
  'crankshaft': '크랭크샤프트',
  'piston': '피스톤',
  'ring': '피스톤 링',
  'pin': '피스톤 핀',
  'conrod': '커넥팅로드',
  'cap': '커넥팅로드 측',
  'bolt': '커넥팅로드 볼트',
};

// 부품명에서 한글 이름 가져오기
export function getPartDisplayName(partName: string): string {
  if (partName === 'crankshaft') return PART_NAMES['crankshaft'];
  
  // cyl1-piston, cyl2-ring0 등의 형식에서 부품명 추출
  const match = partName.match(/cyl(\d+)-(.+?)(-?\d*)$/);
  if (match) {
    const [, cylNum, partType, partIndex] = match;
    let baseName = '';
    
    if (partType === 'piston') baseName = PART_NAMES['piston'];
    else if (partType === 'ring') baseName = PART_NAMES['ring'];
    else if (partType === 'pin') baseName = PART_NAMES['pin'];
    else if (partType === 'conrod') baseName = PART_NAMES['conrod'];
    else if (partType === 'cap') baseName = PART_NAMES['cap'];
    else if (partType === 'bolt') baseName = PART_NAMES['bolt'];
    else baseName = partType;
    
    const indexStr = partIndex ? ` ${parseInt(partIndex) + 1}` : '';
    return `실린더 ${cylNum} - ${baseName}${indexStr}`;
  }
  
  return partName;
}

// V4 엔진 배치 상수
// 조립도 기준: 크랭크샤프트가 Z축 방향으로 놓여있고 피스톤이 Y축 위로 세워져 있음
const ENGINE_CONFIG = {
  // 4개 실린더의 Z축 위치 - 크랭크샤프트의 4개 크랭크핀 위치에 맞춤
  // 크랭크샤프트 모델 전체 길이를 커버하도록 배치
  cylinderZPositions: [-0.035, -0.012, 0.012, 0.035],
  
  // 각 실린더의 크랭크 각도 (직렬 4기통: 피스톤 1,4는 하사점, 2,3은 상사점)
  crankAngles: [Math.PI, 0, 0, Math.PI], // 180°, 0°, 0°, 180°
  
  // 크랭크 반경 (크랭크핀까지의 거리)
  crankRadius: 0.012,
  
  // 커넥팅로드 길이
  conrodLength: 0.035,
  
  // 기본 높이 오프셋 (크랭크샤프트 중심 높이)
  baseHeight: 0.0,
};

interface PartProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  partName: string;
  isSelected: boolean;
  onClick: (partName: string) => void;
}

// 개별 부품 컴포넌트
function Part({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, partName, isSelected, onClick }: PartProps) {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

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
    onClick(partName);
  };

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
    />
  );
}

// 실린더 유닛 - 하나의 실린더 어셈블리 (피스톤 + 커넥팅로드 + 부속품)
interface CylinderUnitProps {
  cylinderIndex: number;
  zPosition: number;
  crankAngle: number;
  selectedPart: string | null;
  onPartClick: (partName: string) => void;
  baseHeight: number;
  crankRadius: number;
  conrodLength: number;
}

function CylinderUnit({ cylinderIndex, zPosition, crankAngle, selectedPart, onPartClick, baseHeight, crankRadius, conrodLength }: CylinderUnitProps) {
  
  // 크랭크 각도에 따른 위치 계산
  const crankPinY = crankRadius * Math.cos(crankAngle);
  const crankPinX = crankRadius * Math.sin(crankAngle);
  
  // 커넥팅로드 각도 (피스톤이 수직으로만 움직이도록)
  const rodAngle = Math.asin(crankPinX / conrodLength);
  
  // 피스톤 높이 계산
  const pistonHeight = baseHeight + crankPinY + conrodLength * Math.cos(rodAngle);

  const prefix = `cyl${cylinderIndex}`;

  return (
    <group position={[0, 0, zPosition]}>
      {/* 피스톤 - Y축 위로 수직으로 세워짐 */}
      <Part
        url={PART_PATHS.piston}
        position={[0, pistonHeight + 0.025, 0]}
        rotation={[0, 0, 0]}
        partName={`${prefix}-piston`}
        isSelected={selectedPart === `${prefix}-piston`}
        onClick={onPartClick}
      />

      {/* 피스톤 링 3개 */}
      {[0, 1, 2].map((ringIndex) => (
        <Part
          key={`ring-${ringIndex}`}
          url={PART_PATHS.pistonRing}
          position={[0, pistonHeight + 0.035 - ringIndex * 0.004, 0]}
          rotation={[0, 0, 0]}
          partName={`${prefix}-ring${ringIndex}`}
          isSelected={selectedPart === `${prefix}-ring${ringIndex}`}
          onClick={onPartClick}
        />
      ))}

      {/* 피스톤 핀 */}
      <Part
        url={PART_PATHS.pistonPin}
        position={[0, pistonHeight + 0.01, 0]}
        rotation={[0, 0, 0]}
        partName={`${prefix}-pin`}
        isSelected={selectedPart === `${prefix}-pin`}
        onClick={onPartClick}
      />

      {/* 커넥팅 로드 - 수직으로 세운 상태 */}
      <Part
        url={PART_PATHS.connectingRod}
        position={[crankPinX * 0.5, baseHeight + crankPinY + conrodLength * 0.5, 0]}
        rotation={[0, 0, rodAngle]}
        partName={`${prefix}-rod`}
        isSelected={selectedPart === `${prefix}-rod`}
        onClick={onPartClick}
      />

      {/* 커넥팅 로드 캡 */}
      <Part
        url={PART_PATHS.connectingRodCap}
        position={[crankPinX, baseHeight + crankPinY - 0.008, 0]}
        rotation={[0, 0, rodAngle]}
        partName={`${prefix}-cap`}
        isSelected={selectedPart === `${prefix}-cap`}
        onClick={onPartClick}
      />

      {/* 볼트 2개 */}
      <Part
        url={PART_PATHS.conrodBolt}
        position={[crankPinX, baseHeight + crankPinY - 0.015, 0.008]}
        rotation={[0, 0, 0]}
        partName={`${prefix}-bolt0`}
        isSelected={selectedPart === `${prefix}-bolt0`}
        onClick={onPartClick}
      />
      <Part
        url={PART_PATHS.conrodBolt}
        position={[crankPinX, baseHeight + crankPinY - 0.015, -0.008]}
        rotation={[0, 0, 0]}
        partName={`${prefix}-bolt1`}
        isSelected={selectedPart === `${prefix}-bolt1`}
        onClick={onPartClick}
      />
    </group>
  );
}

// V4 엔진 전체 조립체
interface V4EngineAssemblyProps {
  onSelectPart?: (partName: string | null, displayName: string | null) => void;
}

export function V4EngineAssembly({ onSelectPart }: V4EngineAssemblyProps) {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // Leva 컨트롤로 실시간 위치 조정
  const { cyl1Z, cyl2Z, cyl3Z, cyl4Z, baseHeight, crankRadius, conrodLength } = useControls('엔진 배치', {
    '실린더 Z 위치': folder({
      cyl1Z: { value: -0.08, min: -0.1, max: 0.1, step: 0.001, label: '실린더 1' },
      cyl2Z: { value: -0.03, min: -0.1, max: 0.1, step: 0.001, label: '실린더 2' },
      cyl3Z: { value: 0.03, min: -0.1, max: 0.1, step: 0.001, label: '실린더 3' },
      cyl4Z: { value: 0.08, min: -0.1, max: 0.1, step: 0.001, label: '실린더 4' },
    }),
    '크랭크 설정': folder({
      baseHeight: { value: 0.0, min: -0.05, max: 0.05, step: 0.001, label: '기본 높이' },
      crankRadius: { value: 0.012, min: 0.005, max: 0.03, step: 0.001, label: '크랭크 반경' },
      conrodLength: { value: 0.035, min: 0.02, max: 0.06, step: 0.001, label: '커넥팅로드 길이' },
    }),
  });

  const cylinderZPositions = [cyl1Z, cyl2Z, cyl3Z, cyl4Z];
  const { crankAngles } = ENGINE_CONFIG;

  const handlePartClick = (partName: string) => {
    const newSelected = selectedPart === partName ? null : partName;
    setSelectedPart(newSelected);
    
    if (onSelectPart) {
      if (newSelected) {
        onSelectPart(newSelected, getPartDisplayName(newSelected));
      } else {
        onSelectPart(null, null);
      }
    }
    console.log('Selected:', partName);
  };

  const handleBackgroundClick = () => {
    setSelectedPart(null);
    if (onSelectPart) {
      onSelectPart(null, null);
    }
  };

  return (
    <group onClick={handleBackgroundClick} scale={5}>
      {/* 전체 엔진을 Y축 기준 90도 회전하여 Z축 방향으로 배치 */}
      <group rotation={[0, Math.PI / 2, 0]}>
        {/* 크랭크샤프트 */}
        <Part
          url={PART_PATHS.crankshaft}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          partName="crankshaft"
          isSelected={selectedPart === 'crankshaft'}
          onClick={handlePartClick}
        />

        {/* 4개의 실린더 유닛 - 크랭크샤프트와 같은 좌표계에서 배치 */}
        {cylinderZPositions.map((zPos: number, index: number) => (
          <CylinderUnit
            key={index}
            cylinderIndex={index + 1}
            zPosition={zPos}
            crankAngle={crankAngles[index]}
            selectedPart={selectedPart}
            onPartClick={handlePartClick}
            baseHeight={baseHeight}
            crankRadius={crankRadius}
            conrodLength={conrodLength}
          />
        ))}
      </group>
    </group>
  );
}

// GLB 파일 프리로드
Object.values(PART_PATHS).forEach(path => {
  useGLTF.preload(path);
});
