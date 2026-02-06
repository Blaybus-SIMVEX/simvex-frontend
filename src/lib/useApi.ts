import { apiClient } from '@/lib/apiClient';
import { useCallback, useState } from 'react';

export function useApi<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: unknown) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiClient<T>(url, method, body);
        setData(result);
        return result;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '알 수 없는 에러 발생';
        setError(errMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    data,
    isLoading,
    error,

    GET: (url: string) => execute(url, 'GET'),
    POST: (url: string, body?: unknown) => execute(url, 'POST', body),
    PUT: (url: string, body?: unknown) => execute(url, 'PUT', body),
    PATCH: (url: string, body?: unknown) => execute(url, 'PATCH', body),
    DELETE: (url: string) => execute(url, 'DELETE'),
  };
}
