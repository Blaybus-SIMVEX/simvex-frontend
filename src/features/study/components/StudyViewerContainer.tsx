'use client';

import ThreeDViewer from '@/app/components/3DViewer';
import InfoModal from '@/app/components/InfoModal';
import { useObjectDetail } from '@/features/3d-viewer/api/use3DViewer';
import { useEffect, useState } from 'react';

// nameEn을 modelType으로 매핑
const NAME_TO_MODEL_TYPE: Record<string, string> = {
  'V4 Engine': 'engine',
  'Coil Suspension': 'suspension',
  'Machine Vice': 'machine-vice',
  'Robot Arm': 'robot-arm',
  'Robot Gripper': 'robot-gripper',
  'Leaf Spring': 'leaf-spring',
  'Quadcopter Drone': 'drone',
};

interface StudyViewerContainerProps {
  objectId: number;
}

export default function StudyViewerContainer({ objectId }: StudyViewerContainerProps) {
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(true);

  const { objectDetail, fetchObjectDetail } = useObjectDetail();

  useEffect(() => {
    if (objectId) {
      fetchObjectDetail(objectId);
    }
  }, [objectId, fetchObjectDetail]);

  // nameEn에서 modelType 추출
  const modelType = objectDetail?.nameEn ? NAME_TO_MODEL_TYPE[objectDetail.nameEn] || 'robot-arm' : 'robot-arm';

  return (
    <div className="flex-1 h-full relative border border-[#ECECEC] rounded-lg overflow-hidden shadow-sm bg-white">
      <ThreeDViewer
        modelType={
          modelType as
            | 'engine'
            | 'drone'
            | 'robot-arm'
            | 'robot-gripper'
            | 'machine-vice'
            | 'leaf-spring'
            | 'suspension'
        }
        selectedPart={null}
        onSelectPart={(partName) => {
          setSelectedPartName(partName);
          if (partName) setIsInfoPanelOpen(true);
        }}
      />

      {/* Info Panel - Floating over 3D Viewer (Right side) */}
      {isInfoPanelOpen && (
        <div className="absolute top-4 right-4 bottom-4 z-20 animate-slide-in-right">
          <InfoModal
            objectId={objectId}
            onClose={() => {
              setSelectedPartName(null);
              setIsInfoPanelOpen(false);
            }}
            selectedPartName={selectedPartName}
          />
        </div>
      )}
    </div>
  );
}
