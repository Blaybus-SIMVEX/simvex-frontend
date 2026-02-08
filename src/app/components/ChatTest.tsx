// TODO: 삭제 컴포넌트

'use client';
import { useApi } from '@/lib/useApi';

interface ChatResponse {
  answer: string;
  id: number;
}

export default function ChatTest() {
  const { POST, data, isLoading, error } = useApi<ChatResponse>();

  const handleSend = async () => {
    try {
      await POST('/api/ai/chat', {
        object3DId: 1,
        question: '브레이크 디스크 재질이 뭐야?',
        conversationHistory: [],
      });
      console.log('전송 성공!');
    } catch {
      console.error('실패...');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleSend}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isLoading ? '답변 기다리는 중...' : '질문하기'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {data && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <strong>AI 답변:</strong> {data.answer}
        </div>
      )}
    </div>
  );
}
