'use client';

import ObjectCard from '@/features/study/components/ObjectCard';
import { IObjects } from '@/features/study/types';
import { useApi } from '@/lib/useApi';
import { PaginationContainer } from '@/shared/ui/PaginationContainer';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function CardList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const { GET, data, isLoading, error } = useApi<IObjects>();

  useEffect(() => {
    GET(`/api/objects?page=${page}`);
  }, [page, GET]);

  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-red-500">
        데이터를 불러오는데 실패했습니다: {error}
      </div>
    );
  }

  const content = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 0;

  if (!isLoading && content.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-500">등록된 학습 콘텐츠가 없습니다.</div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2.5 gap-y-3 w-full">
        {content.map((item) => (
          <ObjectCard key={item.id} data={item} />
        ))}
      </div>
      <div className="flex w-full justify-center items-center mt-12 mb-20">
        {totalPages > 0 && <PaginationContainer totalPages={totalPages} />}
      </div>
    </>
  );
}
