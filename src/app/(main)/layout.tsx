import { ReactNode } from 'react';
import Header from '@/shared/widgets/header/Header';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
