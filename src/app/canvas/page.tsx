'use client';

import { DroneAssembly } from '@/app/components/DroneAssembly';
import { V4EngineAssembly } from '@/app/components/V4EngineAssembly';
import { OrbitControls, Stage } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';

interface SelectedPartInfo {
  partName: string;
  displayName: string;
}

type ModelType = 'engine' | 'drone';

// TODO: public/models 폴더는 삭제할 것
export default function Home() {
  const [selectedPart, setSelectedPart] = useState<SelectedPartInfo | null>(null);
  const [modelType, setModelType] = useState<ModelType>('drone'); // 기본값: 드론

  const handleSelectPart = (partName: string | null, displayName: string | null) => {
    if (partName && displayName) {
      setSelectedPart({ partName, displayName });
    } else {
      setSelectedPart(null);
    }
  };

  const modelTitles: Record<ModelType, string> = {
    engine: 'V4 엔진 조립 뷰어',
    drone: '드론 조립 뷰어',
  };

  return (
    <main className="flex flex-col w-screen h-screen bg-white">
      {/* Header */}
      <header className="p-6 pb-2">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-black border-b-4 border-blue-500 inline-block pb-1">
            {modelTitles[modelType]}
          </h1>
          {/* 모델 선택 버튼 */}
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => {
                setModelType('engine');
                setSelectedPart(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                modelType === 'engine' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              🔧 V4 엔진
            </button>
            <button
              onClick={() => {
                setModelType('drone');
                setSelectedPart(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                modelType === 'drone' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              🚁 드론
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          부품을 클릭하여 선택하면 청록색으로 하이라이트됩니다. 마우스로 드래그하여 회전, 스크롤로 확대/축소할 수
          있습니다.
        </p>
      </header>

      {/* Content Container */}
      <div className="flex flex-1 overflow-hidden p-6 pt-2">
        {/* Left Panel - 3D Viewer */}
        <section className="relative flex-1 bg-gray-200 rounded-l-lg overflow-hidden">
          <Canvas camera={{ position: [2, 1.5, 2], fov: 50 }} className="w-full h-full">
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6} adjustCamera={false}>
                {modelType === 'engine' ? (
                  <V4EngineAssembly onSelectPart={handleSelectPart} />
                ) : (
                  <DroneAssembly onSelectPart={handleSelectPart} />
                )}
              </Stage>
            </Suspense>
            <OrbitControls makeDefault />
          </Canvas>

          {/* 부품 이름 툴팁 */}
          {selectedPart && (
            <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-none animate-fade-in">
              <span className="text-lg font-semibold">{selectedPart.displayName}</span>
            </div>
          )}
        </section>

        {/* Right Panel - Sidebar */}
        <section className="w-[400px] bg-gray-600 rounded-r-lg p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Grid Section */}
          <div className="grid grid-cols-3 gap-4">
            {/* 3x2 Grid Placeholders */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square bg-gray-400 hover:bg-gray-300 transition-colors cursor-pointer ${i === 1 || i === 4 ? 'bg-gray-300 flex items-center justify-center opacity-80' : ''}`}
              >
                {/* Visual mocking for specific items based on screenshot */}
                {i === 1 && <span className="text-4xl text-gray-500">⚙️</span>}
                {i === 4 && <span className="text-4xl text-gray-500">🔧</span>}
              </div>
            ))}
          </div>

          {/* Selected Part Info */}
          {selectedPart && (
            <div className="bg-blue-500/20 border border-blue-500 p-4 rounded-lg">
              <h3 className="text-white font-bold text-lg mb-2">선택된 부품</h3>
              <p className="text-blue-200 text-xl">{selectedPart.displayName}</p>
            </div>
          )}

          {/* Description List Section */}
          <div className="flex flex-col gap-4 flex-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 p-4 h-32 rounded-sm text-black text-sm font-medium relative">
                상세 설명
                {/* Scrollbar visual mock on the right of the container if needed, but flex gap handles spacing */}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
