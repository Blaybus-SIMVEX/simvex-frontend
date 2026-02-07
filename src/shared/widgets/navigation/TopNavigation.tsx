'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Study', href: '/study' },
  { label: 'CAD', href: '/cad' },
  { label: 'Lab', href: '/lab' },
];

export default function TopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col justify-center items-center',
              'w-[110px] h-[36px]',
              'rounded-[8px]',
              'text-[16px] text-gray-600',

              // 2. 상태에 따른 스타일 분기
              isActive
                ? 'bg-primary-100 text-primary-500 font-bold'
                : 'bg-transparent text-gray-500 font-normal hover:text-gray-900 hover:bg-gray-50', // 기본: 회색 글씨 + 호버 효과
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
