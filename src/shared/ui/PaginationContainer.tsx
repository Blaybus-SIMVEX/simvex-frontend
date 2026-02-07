'use client';

import { Pagination } from '@/shared/ui/Pagination';
import { useRouter, useSearchParams } from 'next/navigation';

export function PaginationContainer({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());

    router.push(`?${params.toString()}`);
  };

  return <Pagination totalPage={totalPages} currentPage={currentPage} setPage={handlePageChange} />;
}
