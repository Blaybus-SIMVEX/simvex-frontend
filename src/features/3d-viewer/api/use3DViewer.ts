import { IApiResponse, IComponent, IComponentList, IObjectDetail } from '../types';
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
