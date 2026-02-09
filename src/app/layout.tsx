import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../assets/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'SIMVEX | 3D Engineering Learning Platform',
  description: '복잡한 기계 구조를 3D 시각화로 학습할 수 있는 공학 학습 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} antialiased font-sans`}>{children}</body>
    </html>
  );
}
