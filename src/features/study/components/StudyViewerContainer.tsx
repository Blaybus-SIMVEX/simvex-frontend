'use client';

import ThreeDViewer from '@/app/components/3DViewer';
import InfoModal from '@/app/components/InfoModal';
import { useState } from 'react';

interface StudyViewerContainerProps {
  objectId: number;
}

export default function StudyViewerContainer({ objectId }: StudyViewerContainerProps) {
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);

  return (
    <div className="flex-1 h-full relative border border-[#ECECEC] rounded-lg overflow-hidden shadow-sm bg-white">
      <ThreeDViewer
        modelType={'engine'} // This could be dynamic based on objectDetail if needed
        selectedPart={null} // Currently null, could be extended
        onSelectPart={(partName) => setSelectedPartName(partName)}
      />

      {/* Info Panel - Floating over 3D Viewer (Right side) */}
      <div className="absolute top-4 right-4 bottom-4 z-20 animate-slide-in-right">
        <InfoModal objectId={objectId} onClose={() => setSelectedPartName(null)} selectedPartName={selectedPartName} />
      </div>
    </div>
  );
}
