'use client';

import { streamApiClient } from '@/lib/streamApiClient';
import { useCallback, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useChatStream(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (question: string, object3DId: number) => {
    // 1. 사용자 메시지 UI에 즉시 추가
    const userMsgId = Date.now().toString();
    const userMsg: Message = { id: userMsgId, role: 'user', content: question };

    // 2. AI 메시지 빈 껍데기 추가 (여기에 글자가 쌓임)
    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = { id: aiMsgId, role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setIsLoading(true);

    await streamApiClient(
      '/api/ai/chat',
      { object3DId, question },
      {
        onChunk: (text) => {
          // 한 글자씩 올 때마다 마지막 메시지(AI) 업데이트
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? { ...msg, content: msg.content + text } // 기존 내용에 덧붙이기
                : msg,
            ),
          );
        },
        onComplete: () => {
          setIsLoading(false);
        },
        onError: (err) => {
          console.error(err.message);
          setIsLoading(false);
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), role: 'assistant', content: '에러가 발생했습니다. 다시 시도해주세요.' },
          ]);
        },
      },
    );
  }, []);

  return { messages, sendMessage, isLoading };
}
