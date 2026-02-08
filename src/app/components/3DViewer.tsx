'use client';

import { DroneAssembly } from '@/app/components/DroneAssembly';
import { OrbitControls, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import ViewerControls from './ViewerControls';

interface SelectedPartInfo {
  partName: string;
  displayName: string;
}

type ModelType = 'engine' | 'drone';

interface ThreeDViewerProps {
  modelType: ModelType;
  selectedPart: SelectedPartInfo | null;
  onSelectPart: (partName: string | null, displayName: string | null) => void;
}

export default function ThreeDViewer({
  modelType,
  selectedPart,
  onSelectPart,
}: ThreeDViewerProps) {
  const [assemblyStep, setAssemblyStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const hasInteracted = useState(false); // Using state to trigger re-renders if needed, or better, a ref.
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
  }, []);

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

  return (
    <div className="relative w-full h-full bg-[#BCCCDC] overflow-hidden group">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} className="w-full h-full">
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={false}>
              <DroneAssembly onSelectPart={onSelectPart} />
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>

      {/* Refactored Viewer Controls */}
      <ViewerControls
        assemblyStep={assemblyStep}
        onAssemblyStepChange={setAssemblyStep}
        onToggleFullscreen={toggleFullscreen}
        showTooltip={showTooltip}
        onTooltipDismiss={() => setShowTooltip(false)}
      />


    </div>
  );
}
