const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface StreamOptions {
  onChunk: (text: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export async function streamApiClient(
  endpoint: string,
  body: unknown,
  { onChunk, onComplete, onError }: StreamOptions,
) {
  const url = `${BASE_URL}${endpoint}`;
  const sessionToken = localStorage.getItem('session-token') || '';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        sessionToken: sessionToken,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stream Error ${response.status}: ${errorText}`);
    }

    if (!response.body) throw new Error('ReadableStream not supported.');

    // 스트림 읽기 시작
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // 데이터 파싱 (data: ... 형태 처리)
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const text = line.replace(/^data:/, '');

          onChunk(text);
        }
      }
    }

    if (onComplete) onComplete();
  } catch (error) {
    console.error('Stream API Error:', error);
    if (onError) onError(error instanceof Error ? error : new Error('Unknown Stream Error'));
  }
}
