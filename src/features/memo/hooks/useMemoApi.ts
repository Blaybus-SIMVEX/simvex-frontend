import { IApiResponse } from '@/features/3d-viewer/types';
import { IMemo, IMemoList } from '@/features/memo/types';
import { useApi } from '@/lib/useApi';
import { useCallback } from 'react';

export const useMemos = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IMemoList>>();

  const fetchMemos = useCallback(
    async (objectId: number, token: string, page: number = 1, size: number = 8) => {
      return GET(`/api/objects/${objectId}/memos?page=${page}&size=${size}`, {
        headers: {
          sessionToken: token,
        },
      });
    },
    [GET],
  );

  return {
    memos: data?.data?.content || [],
    totalPages: data?.data?.totalPages || 0,
    isLoading,
    error,
    fetchMemos,
  };
};

export const useMemoActions = () => {
  const { POST: create, PUT: update, DELETE: remove, isLoading, error } = useApi<IApiResponse<IMemo>>();

  const createMemo = useCallback(
    async (objectId: number, token: string, content: string) => {
      return create(
        `/api/objects/${objectId}/memos`,
        { content }, // Body
        {
          headers: { sessionToken: token },
        },
      );
    },
    [create],
  );

  const updateMemo = useCallback(
    async (memoId: number, token: string, content: string) => {
      return update(
        `/api/memos/${memoId}`,
        { content }, // Body
        {
          headers: { sessionToken: token },
        },
      );
    },
    [update],
  );

  const deleteMemo = useCallback(
    async (memoId: number, token: string) => {
      // DELETE는 Body가 없으므로 두 번째 인자가 바로 options입니다.
      return remove(`/api/memos/${memoId}`, {
        headers: { sessionToken: token },
      });
    },
    [remove],
  );

  return { createMemo, updateMemo, deleteMemo, isLoading, error };
};
