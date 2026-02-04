'use client';

import {Canvas} from '@react-three/fiber';
import {OrbitControls, Stage} from '@react-three/drei';
import {Model} from '@/app/components/Model';
import {Suspense} from 'react';

export default function Home() {
  return (
    <main className="flex flex-col w-screen h-screen bg-white">
      {/* Header */}
      <header className="p-6 pb-2">
        <h1 className="text-3xl font-bold text-black border-b-4 border-blue-500 inline-block pb-1">3D 뷰어</h1>
      </header>

      {/* Content Container */}
      <div className="flex flex-1 overflow-hidden p-6 pt-2">
        {/* Left Panel - 3D Viewer */}
        <section className="relative flex-1 bg-gray-200 rounded-l-lg overflow-hidden">
          {/* Slider Placeholder */}
          <div className="absolute left-6 top-10 bottom-10 w-2 bg-gray-500 rounded-full z-10 flex flex-col justify-center items-center">
            {/* Top Indicator */}
            <div className="absolute top-0 w-8 h-8 bg-gray-600 rounded-sm mb-2 -mt-10"></div>

            {/* Thumb */}
            <div className="w-8 h-8 bg-gray-400 rounded-full shadow-lg cursor-pointer hover:bg-gray-300 transition-colors"></div>

            {/* Bottom Indicators */}
            <div className="absolute bottom-0 flex flex-col gap-2 -mb-20">
              <div className="w-8 h-8 bg-gray-600 rounded-sm"></div>
              <div className="w-8 h-8 bg-gray-600 rounded-sm"></div>
            </div>
          </div>

          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full">
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6}>
                <Model url="/models/Drone/Beater disc.glb" />
              </Stage>
            </Suspense>
            <OrbitControls makeDefault />
          </Canvas>
        </section>

        {/* Right Panel - Sidebar */}
        <section className="w-[400px] bg-gray-600 rounded-r-lg p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Grid Section */}
          <div className="grid grid-cols-3 gap-4">
            {/* 3x2 Grid Placeholders */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`aspect-square bg-gray-400 hover:bg-gray-300 transition-colors cursor-pointer ${i === 1 || i === 4 ? 'bg-gray-300 flex items-center justify-center opacity-80' : ''}`}>
                {/* Visual mocking for specific items based on screenshot */}
                {i === 1 && <span className="text-4xl text-gray-500">⚙️</span>}
                {i === 4 && <span className="text-4xl text-gray-500">🔧</span>}
              </div>
            ))}
          </div>

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
