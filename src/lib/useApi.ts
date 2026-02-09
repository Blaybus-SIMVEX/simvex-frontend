import { apiClient } from '@/lib/apiClient';
import { useCallback, useState } from 'react';

interface ApiOptions {
  headers?: Record<string, string>;
}

export function useApi<T = unknown>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', body?: unknown, options?: ApiOptions) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiClient<T>(url, method, body, options);
        setData(result);
        return result;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : '알 수 없는 에러 발생';
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const GET = useCallback((url: string, options?: ApiOptions) => execute(url, 'GET', undefined, options), [execute]);
  const POST = useCallback(
    (url: string, body?: unknown, options?: ApiOptions) => execute(url, 'POST', body, options),
    [execute],
  );
  const PUT = useCallback(
    (url: string, body?: unknown, options?: ApiOptions) => execute(url, 'PUT', body, options),
    [execute],
  );
  const PATCH = useCallback(
    (url: string, body?: unknown, options?: ApiOptions) => execute(url, 'PATCH', body, options),
    [execute],
  );
  const DELETE = useCallback(
    (url: string, options?: ApiOptions) => execute(url, 'DELETE', undefined, options),
    [execute],
  );

  return {
    data,
    isLoading,
    error,
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
  };
}
