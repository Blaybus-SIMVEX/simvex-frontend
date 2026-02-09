'use client';

import { useApi } from '@/lib/useApi';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'session-token';

// API 응답 타입 정의
interface SessionResponse {
  message: string;
  data: {
    sessionToken: string;
  };
  timestamp: string;
}

export function useSessionInit() {
  const [isSessionReady, setIsSessionReady] = useState(false);

  const { GET, POST } = useApi<SessionResponse>();

  useEffect(() => {
    const initSession = async () => {
      // 1. 로컬 스토리지에서 기존 토큰 확인
      let token = localStorage.getItem(SESSION_KEY);
      let isValid = false;

      // 2. 토큰이 있다면 유효성 검사 (GET)
      if (token) {
        try {
          await GET(`/api/sessions/${token}`);
          isValid = true;
        } catch (error) {
          console.error(error);
          isValid = false;
        }
      }

      // 3. 토큰이 없거나 유효하지 않다면 -> 새로 발급 (POST)
      if (!token || !isValid) {
        try {
          const response = await POST('/api/sessions');

          if (response && response.data) {
            const newToken = response.data.sessionToken;
            localStorage.setItem(SESSION_KEY, newToken);
            token = newToken;
          }
        } catch (error) {
          console.error('세션 생성 중 치명적 오류:', error);
        }
      }

      // 4. 모든 과정이 끝나면 준비 완료 상태로 변경
      setIsSessionReady(true);
    };

    initSession();
  }, [GET, POST]);

  return { isSessionReady };
}
