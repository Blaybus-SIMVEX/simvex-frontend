'use client';

import AlertCircleIcon from '@/assets/icons/alert-circle.svg';
import ArrowExpandIcon from '@/assets/icons/arrow-expand.svg';
import ZoomInIcon from '@/assets/icons/zoom-in.svg';
import ZoomOutIcon from '@/assets/icons/zoom-out.svg';
import { useRef, useState } from 'react';

interface ViewerControlsProps {
  assemblyStep: number;
  onAssemblyStepChange: (step: number) => void;
  onToggleFullscreen: () => void;
  showTooltip?: boolean;
  onTooltipDismiss?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export default function ViewerControls({
  assemblyStep,
  onAssemblyStepChange,
  onToggleFullscreen,
  showTooltip = false,
  onTooltipDismiss,
  onZoomIn,
  onZoomOut,
}: ViewerControlsProps) {
  const totalSteps = 5;
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentPercentage = (assemblyStep / totalSteps) * 100;

  const handlePointerMove = (clientY: number) => {
    if (!trackRef.current) return;
    const { top, height } = trackRef.current.getBoundingClientRect();
    const relativeY = clientY - top;

    let percentage = relativeY / height;
    if (percentage < 0) percentage = 0;
    if (percentage > 1) percentage = 1;

    const newAssemblyStep = Math.round(percentage * totalSteps);

    if (newAssemblyStep !== assemblyStep && newAssemblyStep >= 0 && newAssemblyStep <= totalSteps) {
      onAssemblyStepChange(newAssemblyStep);
      onTooltipDismiss?.();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerMove(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handlePointerMove(e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const buttonClass =
    'w-[31px] h-[31px] bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors text-[#333333]';

  const iconClass = 'w-[20px] h-[20px]';

  return (
    <div className="absolute left-6 top-6 bottom-6 flex flex-col items-center justify-between pointer-events-none z-10 w-[32px]">
      {/* 1. 상단 버튼 그룹 */}
      <div className="flex flex-col gap-3 pointer-events-auto items-center">
        <button onClick={onToggleFullscreen} className={buttonClass}>
          {/* ✅ 아이콘에 적용 */}
          <ArrowExpandIcon className={iconClass} />
        </button>

        <div className="relative group/info">
          <button className={buttonClass}>
            <AlertCircleIcon className={iconClass} />
          </button>

          <div className="absolute left-[40px] top-1/2 -translate-y-1/2 bg-[#222222] text-white text-[13px] px-4 py-3 rounded-[8px] shadow-xl pointer-events-none z-30 whitespace-nowrap opacity-0 group-hover/info:opacity-100 transition-opacity duration-200">
            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#222222] border-b-[6px] border-b-transparent"></div>
            오른쪽 버튼을 클릭 시<br />
            화면을 이동할 수 있습니다.
          </div>
        </div>
      </div>

      {/* 2. 슬라이더 트랙 */}
      <div className="pointer-events-auto flex-1 py-4 w-full flex justify-center min-h-[200px]">
        <div className="relative w-[12px] h-full">
          <div
            className="absolute -inset-x-4 inset-y-0 z-20 cursor-pointer touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />

          {/* 회색 트랙 배경 */}
          <div ref={trackRef} className="absolute inset-0 bg-[#E5E5E5] rounded-full overflow-hidden shadow-inner">
            {/* 눈금 */}
            <div className="absolute inset-0 flex flex-col justify-between py-[14px] items-center pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-[4px] h-[1px] bg-white opacity-80"></div>
              ))}
            </div>
          </div>

          {/* 검은색 핸들 */}
          <div
            className="absolute left-0 right-0 h-[28px] bg-[#171717] rounded-full shadow-md z-10 pointer-events-none transition-all duration-150 ease-out flex items-center justify-center"
            style={{
              top: `calc(${currentPercentage}% - 14px)`,
            }}
          >
            <div className="w-[2px] h-[2px] bg-white rounded-full opacity-50"></div>
          </div>

          {/* 툴팁 */}
          {showTooltip && (
            <div
              className="absolute left-[24px] bg-[#222222] text-white text-[13px] px-4 py-3 rounded-[8px] shadow-xl pointer-events-none z-30 whitespace-nowrap animate-fade-in"
              style={{ top: `calc(${currentPercentage}% - 20px)` }}
            >
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#222222] border-b-[6px] border-b-transparent"></div>
              슬라이더를 움직여서
              <br />
              분해과정을 살펴보세요!
            </div>
          )}
        </div>
      </div>

      {/* 3. 하단 줌 버튼 그룹 */}
      <div className="flex flex-col gap-3 pointer-events-auto items-center">
        <button onClick={onZoomIn} className={buttonClass}>
          <ZoomInIcon className={iconClass} />
        </button>
        <button onClick={onZoomOut} className={buttonClass}>
          <ZoomOutIcon className={iconClass} />
        </button>
      </div>
    </div>
  );
}
