'use client';

import ThreeDViewer from '@/app/components/3DViewer';
import AIAssistant from '@/app/components/AIAssistant';
import MemoPad from '@/app/components/MemoPad';
import InfoModal from '@/app/components/InfoModal';
import ChevronLeftyIcon from '@/assets/icons/chevron-lefty.svg';
import { useObjectDetail } from '@/features/3d-viewer/api/use3DViewer';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

export default function StudyDetail() {
  const params = useParams();
  const router = useRouter();
  const objectId = Number(params.detail);

  // 세션 ID 생성 (브라우저 세션 동안 유지)
  const sessionId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    let id = sessionStorage.getItem('simvex-session-id');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('simvex-session-id', id);
    }
    return id;
  }, []);

  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);
  const { objectDetail, isLoading, error, fetchObjectDetail } = useObjectDetail();

  useEffect(() => {
    if (objectId) {
      fetchObjectDetail(objectId);
    }
  }, [objectId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-64px)] bg-[#F5F5F5]">
        <div className="text-[#666666]">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-[calc(100vh-64px)] bg-[#F5F5F5]">
        <div className="text-red-500">오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] bg-[#F5F5F5] px-10 pt-8 pb-6 gap-4">

      {/* Header Area - Vertical Stack */}
      <div className="flex flex-col gap-5 items-start mb-6 shrink-0">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-[6px] bg-[#EDEDED] border border-[#ADADAD] text-[#ADADAD] shadow-sm hover:bg-[#E0E0E0] transition-colors"
        >
            <ChevronLeftyIcon width={24} height={24} color="#AEAEAE"/>
        </button>

        {/* Title & Tags */}
        <div className="flex flex-col gap-3">
            <h1 className="text-[32px] font-bold text-[#111111] leading-tight tracking-tight">
                {objectDetail?.name || '3D 뷰어'}
            </h1>
            <div className="flex gap-3 text-[#888888] text-[16px] font-medium">
                {objectDetail?.categories?.map((category, index) => (
                  <span key={index}>
                    #{category}
                  </span>
                ))}
                 {/* Fallback for static display if categories are empty, matching mockup '#자동차 #기계공학' style */}
                 {!objectDetail?.categories && (
                    <>
                        <span>#자동차</span>
                        <span>#기계공학</span>
                    </>
                 )}
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 w-full gap-4 overflow-hidden">
        {/* Main Content - 3D Viewer (Fluid width) */}
        <div className="flex-1 h-full relative border border-[#ECECEC] rounded-lg overflow-hidden shadow-sm bg-white">
          <ThreeDViewer
            modelType={'engine'}
            selectedPart={null}
            onSelectPart={(partName) => setSelectedPartName(partName)}
          />

          {/* Info Panel - Floating over 3D Viewer (Right side) */}
          {/* {selectedPartName && ( */}
             <div className="absolute top-4 right-4 bottom-4 z-20 animate-slide-in-right">
                <InfoModal
                    objectId={objectId}
                    onClose={() => setSelectedPartName(null)}
                    selectedPartName={selectedPartName}
                />
             </div>
          {/* )} */}
        </div>

        {/* Sidebar - AI & Memo (Fixed 384px) */}
        <div className="w-[384px] min-w-[384px] h-full flex flex-col gap-4 shrink-0">
           {/* AI Assistant - Fixed Height 414px */}
           <div className="h-[414px] shrink-0">
               <AIAssistant objectId={objectId} />
           </div>

           {/* Memo Pad - Fixed Height 200px (Remaining space) */}
           <div className="h-[200px] shrink-0">
              <MemoPad objectId={objectId} sessionId={sessionId} />
           </div>
        </div>
      </div>
    </div>
  );
}
