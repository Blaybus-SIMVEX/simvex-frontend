'use client';

import { clsx } from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  { id: 'ALL', label: '전체' },
  { id: 'MECHANICAL_ENGINEERING', label: '기계공학' },
  { id: 'AUTOMOTIVE', label: '자동차' },
  { id: 'AEROSPACE', label: '항공' },
  { id: 'MACHINE_TOOLS', label: '공작기계' },
  { id: 'ROBOTICS', label: '로봇공학' },
];

export function CategoryFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'ALL';

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams);

    if (id === 'ALL') {
      params.delete('category');
    } else {
      params.set('category', id);
    }

    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center border-b border-gray-200 w-full mb-6">
      {CATEGORIES.map((cat) => {
        const isSelected = currentCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={clsx(
              'cursor-pointer flex justify-center items-center w-[108px] px-2 pb-[3px] text-[16px] transition-all relative whitespace-nowrap flex-shrink-0',

              isSelected
                ? 'text-primary-600 font-bold border-b-2 border-primary-600 -mb-[1px] z-10'
                : 'text-gray-400 font-medium hover:text-gray-600 border-b-2 border-gray-400 -mb-[1px]',
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
