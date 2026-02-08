import { useApi } from '@/lib/useApi';
import {
  IApiResponse,
  IChatRequest,
  IChatResponse,
  IComponent,
  IComponentList,
  IMemo,
  IMemoList,
  IObjectDetail,
} from '../types';

export const useObjectDetail = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IObjectDetail>>();

  const fetchObjectDetail = async (id: number) => {
    return GET(`/api/objects/${id}`);
  };

  return { objectDetail: data?.data, isLoading, error, fetchObjectDetail };
};

export const useComponents = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IComponentList>>();

  const fetchComponents = async (objectId: number) => {
    return GET(`/api/objects/${objectId}/components`);
  };

  return { components: data?.data?.content || [], isLoading, error, fetchComponents };
};

export const useComponentDetail = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IComponent>>();

  const fetchComponentDetail = async (objectId: number, componentId: number) => {
    return GET(`/api/objects/${objectId}/components/${componentId}`);
  };

  return { componentDetail: data?.data, isLoading, error, fetchComponentDetail };
};

export const useMemos = () => {
  const { data, isLoading, error, GET } = useApi<IApiResponse<IMemoList>>();

  const fetchMemos = async (objectId: number, sessionId: string) => {
    return GET(`/api/objects/${objectId}/memos?sessionId=${sessionId}`);
  };

  return { memos: data?.data?.content || [], isLoading, error, fetchMemos };
};

export const useMemoActions = () => {
  const { POST: create, PUT: update, DELETE: remove, isLoading, error } = useApi<IApiResponse<IMemo>>();

  const createMemo = async (objectId: number, sessionId: string, content: string) => {
    return create(`/api/objects/${objectId}/memos?sessionId=${sessionId}`, { content });
  };

  const updateMemo = async (memoId: number, sessionId: string, content: string) => {
    return update(`/api/memos/${memoId}?sessionId=${sessionId}`, { content });
  };

  const deleteMemo = async (memoId: number, sessionId: string) => {
    return remove(`/api/memos/${memoId}?sessionId=${sessionId}`);
  };

  return { createMemo, updateMemo, deleteMemo, isLoading, error };
};

export const useAIChat = () => {
  const { data, isLoading, error, POST } = useApi<IChatResponse>();

  const sendMessage = async (body: IChatRequest) => {
    return POST(`/api/ai/chat`, body);
  };

  return { response: data, isLoading, error, sendMessage };
};
