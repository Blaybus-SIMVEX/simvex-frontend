'use client';

import { DynamicAssembly, ProductConfig } from './DynamicAssembly';

const droneConfig: ProductConfig = {
  productName: '드론',
  modelFolder: 'Drone',
  scale: 5,
  parts: [
    {
      nodeName: 'MainFrame',
      displayName: '메인 프레임',
      fileName: 'Main frame.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, -1, 0],
    },
    {
      nodeName: 'MainFrameMIR',
      displayName: '메인 프레임 (미러)',
      fileName: 'Main frame_MIR.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, 1, 0],
    },
    {
      nodeName: 'ArmGear',
      displayName: '암 기어',
      fileName: 'Arm gear.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, 2, 0],
    },
    {
      nodeName: 'Leg',
      displayName: '다리',
      fileName: 'Leg.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, 3, 0],
    },
    {
      nodeName: 'Gearing',
      displayName: '기어링',
      fileName: 'Gearing.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, 4, 0],
    },
    {
      nodeName: 'ImpellarBlade',
      displayName: '임펠러 블레이드',
      fileName: 'Impellar Blade.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, 5, 0],
    },
    {
      nodeName: 'BeaterDisc',
      displayName: '비터 디스크',
      fileName: 'Beater disc.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, 6, 0],
    },
    {
      nodeName: 'Nut',
      displayName: '너트',
      fileName: 'Nut.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, 7, 0],
    },
    {
      nodeName: 'Screw',
      displayName: '나사',
      fileName: 'Screw.glb',
      originalPosition: [0, 0, 0],
      originalRotation: [0, 0, 0, 1],
      originalScale: [1, 1, 1],
      explosionDirection: [0, 8, 0],
    },
  ],
};

interface DroneAssemblyProps {
  onSelectPart?: (partName: string | null, displayName: string | null) => void;
}

export function DroneAssembly({ onSelectPart }: DroneAssemblyProps) {
  return (
    <DynamicAssembly
      config={droneConfig}
      onSelectPart={onSelectPart}
      assemblyStep={0} // Default step
    />
  );
}
