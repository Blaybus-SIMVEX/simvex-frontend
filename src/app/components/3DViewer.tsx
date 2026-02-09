'use client';

import ViewerControls from './ViewerControls';
import { DynamicAssembly, ProductConfig } from '@/app/components/DynamicAssembly';
import { OrbitControls, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useComponents } from '@/features/3d-viewer/api/use3DViewer';

// Config imports
import droneConfig from '../../../public/models/Drone/config.json';
import engineConfig from '../../../public/models/V4_Engine/config.json';
import robotArmConfig from '../../../public/models/Robot Arm/config.json';
import machineViceConfig from '../../../public/models/Machine Vice/config.json';
import leafSpringConfig from '../../../public/models/Leaf Spring/config.json';
import robotGripperConfig from '../../../public/models/Robot Gripper/config.json';
import suspensionConfig from '../../../public/models/Suspension/config.json';

interface SelectedPartInfo {
  partName: string;
  displayName: string;
}

type ModelType = 'engine' | 'drone' | 'robot-arm' | 'robot-gripper' | 'machine-vice' | 'leaf-spring' | 'suspension';

// 모델 타입별 config 매핑
const MODEL_CONFIGS: Record<string, ProductConfig> = {
  drone: droneConfig as unknown as ProductConfig,
  engine: engineConfig as unknown as ProductConfig,
  'robot-arm': robotArmConfig as unknown as ProductConfig,
  'machine-vice': machineViceConfig as unknown as ProductConfig,
  'leaf-spring': leafSpringConfig as unknown as ProductConfig,
  'robot-gripper': robotGripperConfig as unknown as ProductConfig,
  'suspension': suspensionConfig as unknown as ProductConfig,
};

interface ThreeDViewerProps {
  modelType: ModelType;
  selectedPart: SelectedPartInfo | null;
  onSelectPart: (partName: string | null, displayName: string | null) => void;
}

export default function ThreeDViewer({ onSelectPart, modelType }: ThreeDViewerProps) {
  const [assemblyStep, setAssemblyStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  // 현재 모델 타입에 해당하는 config 가져오기
  const currentConfig = MODEL_CONFIGS[modelType];

  // Fetch components for the selected model (API 연동용, 현재는 config.json 기반으로 동작)
  const { components, fetchComponents } = useComponents();
  const objectId = modelType === 'drone' ? 7 : 1;

  useEffect(() => {
    if (objectId) {
      fetchComponents(objectId);
    }
  }, [objectId, fetchComponents]);


  // Actually, just checking if assemblyStep is 0 might be enough, but the user might move it back to 0.
  // Let's use a ref for the timer.

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show if the user hasn't moved the slider yet (assemblyStep is still 0)
      // and we haven't explicitly dismissed it.
      // To be safe, we just show it. The dismissal logic handles the hiding.
      // But if I want to be strict:
      if (assemblyStep === 0) {
        setShowTooltip(true);
      }
    }, 500); // 0.5s delay
    return () => clearTimeout(timer);
  }, [assemblyStep]);

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Zoom controls ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null);

  const handleZoomIn = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.dollyOut(1.2);
      orbitControlsRef.current.update();
    }

  };

  const handleZoomOut = () => {
   if (orbitControlsRef.current) {
      orbitControlsRef.current.dollyIn(1.2);
      orbitControlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full h-full bg-[#BCCCDC] overflow-hidden group">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [2.5, 2.5, 2.5], fov: 40 }} className="w-full h-full">
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={false} shadows={false}>
            {currentConfig ? (
              <DynamicAssembly
                config={currentConfig}
                onSelectPart={onSelectPart}
                components={components}
                assemblyStep={assemblyStep}
              />
            ) : (
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="gray" />
              </mesh>
            )}
          </Stage>
        </Suspense>
        <OrbitControls ref={orbitControlsRef} makeDefault />
      </Canvas>

      {/* Refactored Viewer Controls */}
      <ViewerControls
        assemblyStep={assemblyStep}
        onAssemblyStepChange={setAssemblyStep}
        onToggleFullscreen={toggleFullscreen}
        showTooltip={showTooltip}
        onTooltipDismiss={() => setShowTooltip(false)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
}
