'use client';

import { useChatStream } from '@/features/ai-chat/hooks/useChatStream';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  objectId: number;
}

export default function AIAssistant({ objectId }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, isLoading } = useChatStream([
    {
      id: 'welcome',
      role: 'assistant',
      content: '궁금한 점이 있다면\n언제든지 물어보세요!',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.SubmitEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const currentInput = input;
    setInput('');
    await sendMessage(currentInput, objectId);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-[12px] py-[16px] bg-white border-b border-[#F5F5F5]">
        <h3 className="font-bold text-[18px] text-[#111111] leading-tight ml-2">AI 어시스턴트</h3>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-[12px] py-4 space-y-4 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed ${
                message.role === 'user'
                  ? 'bg-[#EAEAEA] text-[#333333] rounded-[18px] rounded-tr-[4px] whitespace-pre-wrap'
                  : 'bg-white text-[#333333] border border-[#E5E5E5] rounded-[18px] rounded-tl-[4px] shadow-sm'
              }`}
            >
              {/* ▼▼▼ 여기서부터 수정된 부분입니다 ▼▼▼ */}
              {message.role === 'user' ? (
                message.content
              ) : (
                <ReactMarkdown
                  // Markdown 내부 스타일 정의 (리스트, 문단 간격 등)
                  components={{
                    // ul(점 리스트) 스타일: 왼쪽 여백(pl-5), 점 스타일(list-disc)
                    ul: ({ ...props }) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                    // ol(숫자 리스트) 스타일
                    ol: ({ ...props }) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
                    // li(리스트 아이템) 스타일
                    li: ({ ...props }) => <li className="pl-1" {...props} />,
                    // p(문단) 스타일: 문단 사이에 간격 추가
                    p: ({ ...props }) => <p className="mb-2 last:mb-0 whitespace-pre-wrap" {...props} />,
                    // strong(굵게) 스타일
                    strong: ({ ...props }) => <span className="font-bold text-inherit" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-[18px] rounded-tl-[4px] border border-[#E5E5E5] shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-[12px] bg-white border-t border-[#F5F5F5]">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 내용을 AI에게 물어보세요"
            className="w-full pl-5 pr-12 py-3.5 bg-[#F5F5F5] rounded-[24px] focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[14px] placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 w-8 h-8 flex items-center justify-center bg-[#111111] text-white rounded-full hover:bg-black disabled:opacity-30 transition-all shadow-md"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
