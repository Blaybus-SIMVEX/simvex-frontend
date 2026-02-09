'use client';

import { useObjectDetail } from '@/features/3d-viewer/api/use3DViewer';
import { IComponent } from '@/features/3d-viewer/types';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ComponentPreview = dynamic(() => import('@/features/3d-viewer/components/ComponentPreview'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-[4px]" />,
});

interface InfoModalProps {
  objectId: number;
  onClose?: () => void;
  selectedPartName?: string | null;
}

export default function InfoModal({ objectId, onClose, selectedPartName }: InfoModalProps) {
  const [activeTab, setActiveTab] = useState<'product' | 'detail'>('product');

  const { objectDetail, isLoading, error, fetchObjectDetail } = useObjectDetail();
  console.log(objectDetail);

  useEffect(() => {
    if (objectId && objectId > 0) {
      fetchObjectDetail(objectId);
    }
  }, [objectId, fetchObjectDetail]);

  // 부품 선택 시 detail 탭으로 전환
  // 부품 선택 시 detail 탭으로 전환 (Render Loop 내에서 상태 조정)
  const [prevSelectedPartName, setPrevSelectedPartName] = useState(selectedPartName);
  if (selectedPartName !== prevSelectedPartName) {
    setPrevSelectedPartName(selectedPartName);
    if (selectedPartName) {
      setActiveTab('detail');
    }
  }

  // 완제품 탭 클릭
  const handleProductTabClick = () => {
    setActiveTab('product');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.1)] w-[320px] h-full px-5 py-6 flex items-center justify-center">
        <p className="text-[#666666]">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.1)] w-[320px] h-full px-5 py-6 flex items-center justify-center">
        <p className="text-red-500">오류가 발생했습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-[0px_0px_10px_rgba(0,0,0,0.1)] w-[320px] h-full px-5 py-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-[18px] text-[#111111] leading-tight flex items-center gap-1">
            {objectDetail?.name || ''} ({objectDetail?.nameEn || ''})
          </h2>
          <p className="text-[#666666] text-[13px] font-normal leading-relaxed">{objectDetail?.description || ''}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[#999999] hover:text-[#333333] transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Tags (Chip Buttons) */}
      <div className="flex gap-2">
        <button
          onClick={handleProductTabClick}
          className={`px-3 py-1.5 text-[13px] font-semibold rounded-[20px] border transition-all ${
            activeTab === 'product'
              ? 'bg-[#EBF1FF] text-[#2C74FF] border-[#2C74FF]'
              : 'bg-white text-[#666666] border-[#E5E5E5] hover:bg-gray-50'
          }`}
        >
          완제품
        </button>
        <button
          onClick={() => setActiveTab('detail')}
          className={`px-3 py-1.5 text-[13px] font-semibold rounded-[20px] border transition-all ${
            activeTab === 'detail'
              ? 'bg-[#EBF1FF] text-[#2C74FF] border-[#2C74FF]'
              : 'bg-white text-[#666666] border-[#E5E5E5] hover:bg-gray-50'
          }`}
        >
          부품상세 설명
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4 mt-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pr-2">
        {activeTab === 'product' ? (
          <>
            {/* 이론 섹션 */}
            <div className="space-y-2">
              <h3 className="font-bold text-[16px] text-[#222222]">이론</h3>
              <p className="text-[14px] text-[#444444] leading-[1.6]">{objectDetail?.theory || ''}</p>
            </div>

            {/* 부품 목록 섹션 */}
            {/* <div className="space-y-2 mt-4">
              <h3 className="font-bold text-[16px] text-[#222222]">구성 부품</h3>
              <div className="space-y-2">
                {objectDetail?.components?.map((component) => (
                  <button
                    key={component.id}
                    onClick={handleComponentClick}
                    className="w-full text-left p-3 bg-[#F8F9FA] rounded-lg hover:bg-[#EBF1FF] transition-colors border border-transparent hover:border-[#4880FF]/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-medium text-[#333333]">{component.name}</p>
                        <p className="text-[12px] text-[#666666]">{component.nameEn}</p>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#999"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div> */}
          </>
        ) : (
          <>
            {/* 부품 상세 정보 목록 */}
            <div className="space-y-6 px-1">
              {/* Image Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[...Array(8)].map((_, i) => {
                  const component = objectDetail?.components?.[i];
                  return (
                    <div
                      key={i}
                      className="aspect-square bg-[#F5F5F5] rounded-[4px] overflow-hidden flex items-center justify-center relative border border-gray-100"
                    >
                      {component?.modelFileUrl ? (
                        <div className="w-full h-full">
                          <ComponentPreview modelUrl={component.modelFileUrl} />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          <div className="w-8 h-8 rounded-full bg-gray-200" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Text List */}
              <div className="space-y-5">
                {objectDetail?.components?.map((component: IComponent) => (
                  <div key={component.id} className="border-b border-[#ECECEC] last:border-0 pb-3 last:pb-0">
                    <h3 className="font-semibold text-[14px] text-[#171717] mb-[2px]">
                      {component.name} ({component.nameEn})
                    </h3>
                    <p className="font-medium text-[12px] text-[#767676] leading-[140%] break-keep">{component.role}</p>
                  </div>
                ))}
              </div>

              {!objectDetail?.components?.length && (
                <div className="flex items-center justify-center h-32 text-[#666666] text-[13px]">
                  부품 정보가 없습니다.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
