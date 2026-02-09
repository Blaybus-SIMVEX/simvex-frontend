'use client';

import ArrowExpandIcon from '@/assets/icons/arrow-expand.svg';
import ZoomInIcon from '@/assets/icons/zoom-in.svg';
import ZoomOutIcon from '@/assets/icons/zoom-out.svg';
import React from 'react';

interface ViewerControlsProps {
  assemblyStep: number;
  onAssemblyStepChange: (step: number) => void;
  onToggleFullscreen: () => void;
  showTooltip?: boolean;
  onTooltipDismiss?: () => void;
}

export default function ViewerControls({
  assemblyStep,
  onAssemblyStepChange,
  onToggleFullscreen,
  showTooltip = false,
  onTooltipDismiss,
}: ViewerControlsProps) {
  // Figma styles
  // Frame 65:1693 'step-slider'
  // Background: #ECECEC, width 16px, rounded-full
  // Ticks: #FAFAFA, width 4px, height 2px
  // Handle: #171717, width 20px, height 31px, rounded-full

  // Determine tick count based on Figma design which shows about 10 intervals
  const totalSteps = 10;

  return (
    <div className="absolute left-6 top-6 bottom-6 flex flex-col justify-between items-center pointer-events-none z-10 w-12">
      {/* 1. Fullscreen Button (Top) */}
      <div className="pointer-events-auto">
        <button
          onClick={onToggleFullscreen}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors text-[#333333]"
        >
          <ArrowExpandIcon />
        </button>
      </div>

      {/* 2. Assembly Slider (Center) */}
      <div className="pointer-events-auto flex-1 flex items-center justify-center min-h-0 py-4">
        <div className="relative h-[460px] w-[30px] flex justify-center items-center">
          {/* Track */}
          <div className="absolute h-full w-[16px] bg-[#ECECEC] rounded-full"></div>

          {/* Ticks */}
          <div className="absolute flex flex-col justify-between h-full py-[16px] items-center pointer-events-none z-0">
            {[...Array(totalSteps + 1)].map((_, i) => (
              <div key={i} className="w-[4px] h-[2px] bg-[#FAFAFA]"></div>
            ))}
          </div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max={totalSteps}
            step="1"
            // @ts-expect-error - orient is a valid attribute for range inputs in some browsers but not in React types
            orient="vertical"
            value={totalSteps - assemblyStep}
            onChange={(e) => {
              const newVal = Number(e.target.value);
              onAssemblyStepChange(totalSteps - newVal);
              onTooltipDismiss?.();
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            style={{ WebkitAppearance: 'slider-vertical' }}
          />

          {/* Custom Thumb handle */}
          <div
            className="absolute w-[20px] h-[31px] bg-[#171717] border-[2px] border-[#171717] rounded-full shadow-md z-10 pointer-events-none transition-all"
            style={{
              bottom: `calc((100% - 31px) * ${(totalSteps - assemblyStep) / totalSteps})`,
            }}
          />

          {/* Tooltip */}
          {showTooltip && (
            <div
              className="absolute left-[36px] bg-[#222222] text-white text-[13px] px-4 py-3 rounded-[8px] shadow-xl pointer-events-none leading-[1.5] z-30 whitespace-nowrap animate-fade-in"
              style={{ bottom: `calc((100% - 31px) * ${(totalSteps - assemblyStep) / totalSteps} - 5px)` }}
            >
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#222222] border-b-[6px] border-b-transparent"></div>
              슬라이더를 움직여서
              <br />
              분해과정을 살펴보세요!
            </div>
          )}
        </div>
      </div>

      {/* 3. Zoom Controls (Bottom) */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        <button className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors text-[#333333]">
          <ZoomInIcon />
        </button>
        <button className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors text-[#333333]">
          <ZoomOutIcon />
        </button>
      </div>
    </div>
  );
}
