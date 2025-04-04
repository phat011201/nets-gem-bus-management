import ComponentTransport from '@/components/ComponentTransport';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Công ty CP vận tải ô tô',
};

export default function Admin() {
  return <ComponentTransport />;
}
