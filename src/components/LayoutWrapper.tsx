'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // We don't want to show the header on the login page
  const showHeader = pathname !== '/login';

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
}