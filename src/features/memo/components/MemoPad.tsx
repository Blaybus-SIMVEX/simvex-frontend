'use client';

import { useMemoActions, useMemos } from '@/features/memo/hooks/useMemoApi';
import { IMemo } from '@/features/memo/types';
import { useEffect, useState } from 'react';

interface MemoPadProps {
  objectId: number;
}

export default function MemoPad({ objectId }: MemoPadProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { memos, isLoading, fetchMemos, totalPages = 1 } = useMemos();
  const { createMemo, updateMemo, deleteMemo, isLoading: isActioning } = useMemoActions();

  const [isAdding, setIsAdding] = useState(false);
  const [newMemoText, setNewMemoText] = useState('');
  const [editingMemo, setEditingMemo] = useState<IMemo | null>(null);
  const [editText, setEditText] = useState('');

  const [sessionToken, setSessionToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('session-token');

    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSessionToken(token);
    } else {
      console.warn('로컬스토리지에 session-token이 없습니다.');
    }
  }, []);

  useEffect(() => {
    if (objectId && sessionToken) {
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
      fetchMemos(objectId, token, 1, 8);
    } catch (e) {
      console.error('메모 생성 실패', e);
    }
  };

  const handleUpdateMemo = async () => {
    if (!editingMemo || !editText.trim() || isActioning) return;

    try {
      await updateMemo(editingMemo.id, sessionToken, editText.trim());
      setEditingMemo(null);
      setEditText('');
      fetchMemos(objectId, sessionToken, currentPage, pageSize);
    } catch (e) {
      console.error('Failed to update memo', e);
    }
  };

  const handleDeleteMemo = async (memoId: number) => {
    if (isActioning) return;

    try {
      await deleteMemo(memoId, sessionToken);
      // 삭제 후 데이터 갱신 (데이터가 줄어 페이지가 빌 경우에 대한 처리는 복잡하므로 단순 갱신)
      fetchMemos(objectId, sessionToken, currentPage, pageSize);
    } catch (e) {
      console.error('Failed to delete memo', e);
    }
  };

  const startEditing = (memo: IMemo) => {
    setEditingMemo(memo);
    setEditText(memo.content);
  };

  const cancelEditing = () => {
    setEditingMemo(null);
    setEditText('');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-[#F5F5F5]">
        <h3 className="font-semibold text-[20px] text-[#171717]">메모</h3>
        <button
          onClick={() => setIsAdding(true)}
          disabled={isActioning}
          className="cursor-pointer flex items-center gap-1 pl-3 pr-2 py-1.5 rounded-full border border-[#2C74FF] text-[#2C74FF] text-[12px] font-semibold bg-white hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          추가하기
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 w-full overflow-y-auto px-5 py-4 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="flex flex-col gap-3">
          {/* Input Card */}
          {isAdding && (
            <div className="w-full bg-white border-1 border-[#2C74FF] rounded-[8px] p-3 flex flex-col shadow-sm">
              <textarea
                autoFocus
                value={newMemoText}
                onChange={(e) => setNewMemoText(e.target.value)}
                placeholder="내용을 입력하세요"
                className="w-full h-[60px] resize-none text-[14px] leading-relaxed p-2 bg-gray-100 rounded-md placeholder-gray-400
    border-transparent
    focus:border-transparent
    focus:ring-0
    focus:outline-none"
              />
              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewMemoText('');
                  }}
                  className="cursor-pointer text-xs text-gray-500 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  onClick={handleAddMemo}
                  disabled={isActioning || !newMemoText.trim()}
                  className="cursor-pointer text-xs bg-[#2C74FF] text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  저장
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="w-full h-[100px] flex items-center justify-center">
              <p className="text-gray-400 text-sm">로딩 중...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && memos.length === 0 && !isAdding && (
            <div className="w-full h-[200px] bg-white rounded-[8px] flex flex-col items-center justify-center text-center">
              <p className="text-[#555555] text-[12px]">
                {currentPage === 1 ? '학습중인 내용을 메모로 남겨보세요.' : '메모가 없습니다.'}
              </p>
            </div>
          )}

          {/* Memo List */}
          {memos.map((memo) => (
            <div key={memo.id}>
              {editingMemo?.id === memo.id ? (
                // Edit Mode
                <div className="w-full bg-white border-1 border-[#4880FF] rounded-[8px] p-3 flex flex-col shadow-sm">
                  <textarea
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full h-[60px] resize-none text-[14px] leading-relaxed p-2 bg-gray-100 rounded-md placeholder-gray-400
    border-transparent
    focus:border-transparent
    focus:ring-0
    focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                    <button onClick={cancelEditing} className="text-xs text-gray-500 hover:text-gray-800">
                      취소
                    </button>
                    <button
                      onClick={handleUpdateMemo}
                      disabled={isActioning || !editText.trim()}
                      className="text-xs bg-[#4880FF] text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      수정
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="w-full bg-[#E8F3FF] rounded-[8px] p-3 relative group hover:shadow-md transition-shadow border border-transparent hover:border-[#4880FF]/30">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => startEditing(memo)} className="text-[#8FB6FF] hover:text-[#4880FF] p-1">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button onClick={() => handleDeleteMemo(memo.id)} className="text-[#8FB6FF] hover:text-red-500 p-1">
                      <svg
                        width="14"
                        height="14"
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
                  <p className="text-[#333333] text-[14px] leading-relaxed whitespace-pre-wrap font-medium pr-12">
                    {memo.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!isLoading && (memos.length > 0 || currentPage > 1) && (
        <div className="px-5 py-3 border-t border-[#F5F5F5] flex items-center justify-center gap-4 bg-white">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <span className="text-[12px] font-medium text-gray-500">
            {currentPage} {totalPages > 0 && `/ ${totalPages}`}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={totalPages > 0 && currentPage >= totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
