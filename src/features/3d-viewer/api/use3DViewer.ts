import { IApiResponse, IComponent, IComponentList, IMemo, IMemoList, IObjectDetail } from '../types';
import { useApi } from '@/lib/useApi';
import { useCallback } from 'react';

export const useObjectDetail = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IObjectDetail>>();

  const fetchObjectDetail = useCallback(
    async (id: number) => {
      return GET(`/api/objects/${id}`);
    },
    [GET],
  );

  return { objectDetail: data?.data, isLoading, error, fetchObjectDetail };
};

export const useComponents = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IComponentList>>();

  const fetchComponents = useCallback(
    async (objectId: number) => {
      return GET(`/api/objects/${objectId}/components`);
    },
    [GET],
  );

  return { components: data?.data?.content || [], isLoading, error, fetchComponents };
};

export const useComponentDetail = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IComponent>>();

  const fetchComponentDetail = useCallback(
    async (objectId: number, componentId: number) => {
      return GET(`/api/objects/${objectId}/components/${componentId}`);
    },
    [GET],
  );

  return { componentDetail: data?.data, isLoading, error, fetchComponentDetail };
};

export const useMemos = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IMemoList>>();

  const fetchMemos = useCallback(
    async (objectId: number, sessionId: string) => {
      return GET(`/api/objects/${objectId}/memos?sessionId=${sessionId}`);
    },
    [GET],
  );

  return { memos: data?.data?.content || [], isLoading, error, fetchMemos };
};

export const useMemoActions = () => {
  const { POST: create, PUT: update, DELETE: remove, isLoading, error } = useApi<IApiResponse<IMemo>>();

  const createMemo = useCallback(
    async (objectId: number, sessionId: string, content: string) => {
      return create(`/api/objects/${objectId}/memos?sessionId=${sessionId}`, { content });
    },
    [create],
  );

  const updateMemo = useCallback(
    async (memoId: number, sessionId: string, content: string) => {
      return update(`/api/memos/${memoId}?sessionId=${sessionId}`, { content });
    },
    [update],
  );

  const deleteMemo = useCallback(
    async (memoId: number, sessionId: string) => {
      return remove(`/api/memos/${memoId}?sessionId=${sessionId}`);
    },
    [remove],
  );

  return { createMemo, updateMemo, deleteMemo, isLoading, error };
};
