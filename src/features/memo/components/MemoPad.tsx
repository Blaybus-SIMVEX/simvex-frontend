'use client';

import { useMemoActions, useMemos } from '@/features/memo/hooks/useMemoApi';
import { useEffect, useState } from 'react';

interface MemoPadProps {
  objectId: number;
}

export default function MemoPad({ objectId }: MemoPadProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { memos, isLoading, fetchMemos } = useMemos();
  const { createMemo, deleteMemo, isLoading: isActioning } = useMemoActions();

  const [isAdding, setIsAdding] = useState(false);
  const [newMemoText, setNewMemoText] = useState('');

  // 로컬 스토리지 토큰 관리 (State 제거하고 바로 읽기 권장하지만, 기존 코드 스타일 존중)
  const [sessionToken, setSessionToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('session-token');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) setSessionToken(token);
  }, []);

  useEffect(() => {
    if (objectId && sessionToken) {
      // 최신순 정렬을 위해 API에서 sort=createdAt,desc 등을 지원하면 좋습니다.
      // 지원하지 않는다면 받아온 데이터를 클라이언트에서 뒤집어야 합니다.
      fetchMemos(objectId, sessionToken, currentPage, pageSize);
    }
  }, [objectId, sessionToken, fetchMemos, currentPage]);

  const handleAddMemo = async () => {
    const token = localStorage.getItem('session-token');
    if (!token || !newMemoText.trim() || isActioning) return;

    try {
      await createMemo(objectId, token, newMemoText.trim());
      setNewMemoText('');
      setIsAdding(false);
      // 추가 후 목록 갱신
      fetchMemos(objectId, token, 1, pageSize);
    } catch (e) {
      console.error('메모 생성 실패', e);
    }
  };

  const handleDeleteMemo = async (memoId: number) => {
    const token = localStorage.getItem('session-token');
    if (!token || isActioning) return;
    if (!confirm('메모를 삭제하시겠습니까?')) return;

    try {
      await deleteMemo(memoId, token);
      fetchMemos(objectId, token, currentPage, pageSize);
    } catch (e) {
      console.error('메모 삭제 실패', e);
    }
  };

  const sortedMemos = [...memos].sort((a, b) => b.id - a.id);

  return (
    <div className="flex flex-col w-full bg-white rounded-lg p-4 gap-3 border border-[#E5E5E5]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[16px] text-[#111111]">메모</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          disabled={isActioning}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#2C74FF] text-[#2C74FF] text-[12px] font-semibold hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          추가하기 +
        </button>
      </div>

      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent pb-2">
        <div className="flex gap-3 min-w-min">
          {isAdding && (
            <div className="w-[200px] h-[140px] shrink-0 bg-white border border-[#2C74FF] rounded-[8px] p-3 flex flex-col shadow-sm relative">
              <textarea
                autoFocus
                value={newMemoText}
                onChange={(e) => setNewMemoText(e.target.value)}
                placeholder="내용을 입력하세요"
                className="w-full flex-1 resize-none text-[13px] leading-relaxed p-1 bg-transparent border-none focus:ring-0 focus:outline-none placeholder-gray-400"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setIsAdding(false)} className="text-xs text-gray-500 hover:text-gray-800">
                  취소
                </button>
                <button
                  onClick={handleAddMemo}
                  disabled={!newMemoText.trim()}
                  className="text-xs bg-[#2C74FF] text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  저장
                </button>
              </div>
            </div>
          )}

          {/* 2. Loading State */}
          {isLoading && sortedMemos.length === 0 && (
            <div className="w-[200px] h-[140px] flex items-center justify-center bg-gray-50 rounded-[8px]">
              <p className="text-gray-400 text-xs">로딩 중...</p>
            </div>
          )}

          {/* 3. Empty State */}
          {!isLoading && sortedMemos.length === 0 && !isAdding && (
            <div className="w-full h-[140px] flex items-center justify-center bg-[#F9F9F9] rounded-[8px] text-gray-400 text-xs">
              작성된 메모가 없습니다.
            </div>
          )}

          {/* 4. Memo Cards (가로 나열) */}
          {sortedMemos.map((memo) => (
            <div
              key={memo.id}
              className="w-[200px] h-[140px] shrink-0 bg-[#E8F3FF] rounded-[8px] p-4 relative group hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* 삭제 버튼 (우측 상단 X) */}
              <button
                onClick={() => handleDeleteMemo(memo.id)}
                className="absolute top-3 right-3 text-[#8FB6FF] hover:text-[#2C74FF] transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1 1L13 13M1 13L13 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* 본문 내용 */}
              <div className="w-full h-full overflow-y-auto scrollbar-none pr-4">
                <p className="text-[#333333] text-[13px] leading-relaxed whitespace-pre-wrap break-keep">
                  {memo.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
