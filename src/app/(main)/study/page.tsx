import { CardList } from '@/features/study/components/CardList';
import { CategoryFilter } from '@/features/study/ui/CategoryFilter';
import { Suspense } from 'react';

export default function Study() {
  return (
    <div className="flex flex-col justify-between items-start h-[758px] px-10 mt-9">
      <div className="flex flex-col w-full gap-[30px]">
        <h1 className="text-gray-900 text-[32px] font-bold">학습 콘텐츠 선택</h1>
        <Suspense fallback={<div className="h-12 w-full bg-gray-50 animate-pulse rounded" />}>
          <CategoryFilter />
        </Suspense>
      </div>
      <Suspense fallback={<div className="w-full h-80 flex items-center justify-center">로딩 중...</div>}>
        <CardList />
      </Suspense>
    </div>
  );
}
