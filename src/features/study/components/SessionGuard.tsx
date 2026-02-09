'use client';

import { useSessionInit } from '@/lib/useSessionInit';
import { ReactNode } from 'react';

export default function SessionGuard({ children }: { children: ReactNode }) {
  const { isSessionReady } = useSessionInit();

  if (!isSessionReady) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] w-full bg-white">
        {/* 간단한 스피너나 로딩 텍스트 */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">학습 세션을 준비하고 있습니다...</p>
      </div>
    );
  }

  return <>{children}</>;
}
