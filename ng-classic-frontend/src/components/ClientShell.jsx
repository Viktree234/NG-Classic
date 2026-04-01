'use client';

import { useSyncExternalStore } from 'react';
import AuthBootstrap from '@/components/AuthBootstrap';
import Navbar from '@/components/Navbar';
import WhatsAppButton from '@/components/WhatsAppButton';

function subscribe() {
  return () => {};
}

export default function ClientShell() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <AuthBootstrap />
      <Navbar />
      <WhatsAppButton />
    </>
  );
}
