'use client';

import { useMemoActions, useMemos } from '@/features/3d-viewer/api/use3DViewer';
import { IMemo } from '@/features/3d-viewer/types';
import { useEffect, useState } from 'react';

interface MemoPadProps {
  objectId: number;
}

export default function MemoPad({ objectId }: MemoPadProps) {
  const { memos, isLoading, fetchMemos } = useMemos();
  const { createMemo, updateMemo, deleteMemo, isLoading: isActioning } = useMemoActions();

  const [isAdding, setIsAdding] = useState(false);
  const [newMemoText, setNewMemoText] = useState('');
  const [editingMemo, setEditingMemo] = useState<IMemo | null>(null);
  const [editText, setEditText] = useState('');

  // Session ID management
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Generate or retrieve session ID on mount
    let id = sessionStorage.getItem('simvex-session-id');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('simvex-session-id', id);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionId(id);
  }, []);

  useEffect(() => {
    if (objectId && sessionId) {
      fetchMemos(objectId, sessionId);
    }
  }, [objectId, sessionId, fetchMemos]);

  const handleAddMemo = async () => {
    if (!newMemoText.trim() || isActioning) return;

    try {
      await createMemo(objectId, sessionId, newMemoText.trim());
      setNewMemoText('');
      setIsAdding(false);
      fetchMemos(objectId, sessionId);
    } catch (e) {
      console.error('Failed to create memo', e);
    }
  };

  const handleUpdateMemo = async () => {
    if (!editingMemo || !editText.trim() || isActioning) return;

    try {
      await updateMemo(editingMemo.id, sessionId, editText.trim());
      setEditingMemo(null);
      setEditText('');
      fetchMemos(objectId, sessionId);
    } catch (e) {
      console.error('Failed to update memo', e);
    }
  };

  const handleDeleteMemo = async (memoId: number) => {
    if (isActioning) return;

    try {
      await deleteMemo(memoId, sessionId);
      fetchMemos(objectId, sessionId);
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
          className="flex items-center gap-1 pl-3 pr-2 py-1.5 rounded-full border border-[#2C74FF] text-[#2C74FF] text-[12px] font-semibold bg-white hover:bg-blue-50 transition-colors disabled:opacity-50"
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

      {/* Content Area - Vertical List */}
      <div className="flex-1 w-full overflow-y-auto px-5 py-4 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="flex flex-col gap-3">
          {/* Input Card - New Memo */}
          {isAdding && (
            <div className="w-full bg-white border-2 border-[#2C74FF] rounded-[8px] p-3 flex flex-col shadow-sm">
              <textarea
                autoFocus
                value={newMemoText}
                onChange={(e) => setNewMemoText(e.target.value)}
                placeholder="내용을 입력하세요"
                className="w-full h-[60px] resize-none border-none focus:ring-0 text-[14px] leading-relaxed p-0 placeholder-gray-400"
              />
              <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewMemoText('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  onClick={handleAddMemo}
                  disabled={isActioning || !newMemoText.trim()}
                  className="text-xs bg-[#2C74FF] text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  저장
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="w-full h-[100px] flex items-center justify-center">
              <p className="text-gray-400 text-sm">로딩 중...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && memos.length === 0 && !isAdding && (
            <div className="w-full h-[200px] bg-white rounded-[8px] flex flex-col items-center justify-center text-center">
              <p className="text-[#555555] text-[12px]">학습중인 내용을 메모로 남겨보세요.</p>
            </div>
          )}

          {/* Memo Cards */}
          {memos.map((memo) => (
            <div key={memo.id}>
              {editingMemo?.id === memo.id ? (
                // Edit Mode
                <div className="w-full bg-white border-2 border-[#4880FF] rounded-[8px] p-3 flex flex-col shadow-sm">
                  <textarea
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full h-[60px] resize-none border-none focus:ring-0 text-[14px] leading-relaxed p-0"
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
                  {/* Action Buttons */}
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
    </div>
  );
}
