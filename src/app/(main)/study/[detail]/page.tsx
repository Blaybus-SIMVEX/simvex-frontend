import AIAssistant from '@/features/ai-chat/components/AIAssistant';
import MemoPad from '@/features/memo/components/MemoPad';
import StudyHeader from '@/features/study/components/StudyHeader';
import StudyViewerContainer from '@/features/study/components/StudyViewerContainer';

interface StudyDetailProps {
  params: Promise<{
    detail: string;
  }>;
}

export default async function StudyDetail({ params }: StudyDetailProps) {
  const resolvedParams = await params;
  const objectId = Number(resolvedParams.detail);

  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#F5F5F5] overflow-y-auto">
      <div className="flex flex-col w-full h-full min-h-[700px] px-10 pt-8 pb-6 gap-4">
        {/* Header Area */}
        <StudyHeader objectId={objectId} />

        {/* Content Area */}
        <div className="flex flex-1 w-full gap-4 min-h-0">
          {/* Main Content */}
          <StudyViewerContainer objectId={objectId} />

          {/* Sidebar - AI & Memo (Fixed 384px) */}
          <div className="w-[384px] min-w-[384px] h-full flex flex-col gap-4 shrink-0">
            <div className="h-full flex-1 min-h-0">
              <AIAssistant objectId={objectId} />
            </div>

            <div className="shrink-0">
              <MemoPad objectId={objectId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
