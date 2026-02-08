'use client';

import ChevronLeftyIcon from '@/assets/icons/chevron-lefty.svg';
import { useObjectDetail } from '@/features/3d-viewer/api/use3DViewer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface StudyHeaderProps {
  objectId: number;
}

export default function StudyHeader({ objectId }: StudyHeaderProps) {
  const router = useRouter();
  const { objectDetail, fetchObjectDetail } = useObjectDetail();

  useEffect(() => {
    if (objectId) {
      fetchObjectDetail(objectId);
    }
  }, [objectId, fetchObjectDetail]);

  return (
    <div className="flex flex-col gap-5 items-start mb-6 shrink-0">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="w-8 h-8 flex items-center justify-center rounded-[6px] bg-[#EDEDED] border border-[#ADADAD] text-[#ADADAD] shadow-sm hover:bg-[#E0E0E0] transition-colors"
      >
        <ChevronLeftyIcon width={24} height={24} color="#AEAEAE" />
      </button>

      {/* Title & Tags */}
      <div className="flex flex-col gap-3">
        <h1 className="text-[32px] font-bold text-[#111111] leading-tight tracking-tight">
          {objectDetail?.name || '3D 뷰어'}
        </h1>
        <div className="flex gap-3 text-[#888888] text-[16px] font-medium">
          {objectDetail?.categories?.map((category, index) => (
            <span key={index}>#{category}</span>
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
  );
}
