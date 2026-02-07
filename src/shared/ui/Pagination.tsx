'use client';

import DoubleChevronLeftIcon from '@/assets/icons/chevron-double-left.svg';
import DoubleChevronRightIcon from '@/assets/icons/chevron-double-right.svg';
import ChevronLeftIcon from '@/assets/icons/chevron-lefty.svg';
// TODO: 오른쪽 아이콘으로 변경 필요
import ChevronRightIcon from '@/assets/icons/chevron-lefty.svg';
import { clsx } from 'clsx';

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export function Pagination({ totalPage, currentPage, setPage }: PaginationProps) {
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  const baseButtonClass =
    'cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200';

  const arrowButtonClass =
    'text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent';

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => setPage(1)}
        disabled={currentPage === 1}
        className={clsx(baseButtonClass, arrowButtonClass)}
        aria-label="First Page"
      >
        <DoubleChevronLeftIcon className="flex justify-center items-center" />
      </button>

      {/* 2. 이전 페이지 (<) */}
      <button
        onClick={() => setPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={clsx(baseButtonClass, arrowButtonClass)}
        aria-label="Previous Page"
      >
        <ChevronLeftIcon className="flex justify-center items-center" />
      </button>

      {/* 3. 페이지 번호들 */}
      <div className="flex items-center gap-1 mx-2">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={clsx(
                baseButtonClass,
                'text-[15px] font-medium', // 숫자 폰트 크기 및 굵기
                isActive
                  ? 'bg-primary-500 text-white shadow-sm' // 활성: 파란색 배경
                  : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900', // 비활성: 회색 텍스트
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 4. 다음 페이지 (>) */}
      <button
        onClick={() => setPage(Math.min(totalPage, currentPage + 1))}
        disabled={currentPage === totalPage}
        className={clsx(baseButtonClass, arrowButtonClass)}
        aria-label="Next Page"
      >
        <ChevronRightIcon className="flex justify-center items-center" />
      </button>

      {/* 5. 맨 끝으로 (>>) */}
      <button
        onClick={() => setPage(totalPage)}
        disabled={currentPage === totalPage}
        className={clsx(baseButtonClass, arrowButtonClass)}
        aria-label="Last Page"
      >
        <DoubleChevronRightIcon className="flex justify-center items-center" />
      </button>
    </div>
  );
}
