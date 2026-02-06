// TODO: 삭제 컴포넌트

'use client';
import { useApi } from "@/lib/useApi";

interface ObjectItem {
  id: number;
  name: string;
  nameEn: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
}

export default function ObjectGetTest() {
  const { GET, data, isLoading, error } = useApi<ObjectItem[]>();

  const handleFetchList = async () => {
    try {
      await GET("/api/objects");
      console.log("목록 가져오기 성공!");
    } catch (e) {
      console.error("에러 남:", e);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">API 테스트</h2>

      {/* GET 요청 버튼 */}
      <button
        onClick={handleFetchList}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
      >
        {isLoading ? "로딩 중..." : "📋 오브젝트 목록 가져오기 (GET)"}
      </button>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-100 text-red-600 rounded border border-red-200">
          🚨 에러 발생: {error}
        </div>
      )}

      {/* 결과 데이터 보여주기 */}
      {data && (
        <div className="mt-4 border rounded bg-gray-50 p-4">
          <h3 className="font-bold mb-2">응답 결과 ({data.length}개):</h3>
          {/* 데이터를 예쁘게 JSON 형태로 출력 */}
          <pre className="text-sm overflow-auto max-h-60 bg-white p-2 rounded border">
            {JSON.stringify(data, null, 2)}
          </pre>

          {/* 혹은 리스트로 렌더링하려면: */}
          {/* <ul className="list-disc pl-5 mt-2">
            {data.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul> */}
        </div>
      )}
    </div>
  );
}
