import Header from '@/shared/widgets/header/Header';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-none z-50 h-[60px]">
        <Header />
      </div>
      <main className="flex-1 overflow-y-auto bg-gray-100">{children}</main>
    </div>
  );
}
