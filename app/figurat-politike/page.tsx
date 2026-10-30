// app/figurat-politike/page.tsx
'use client';

import React from 'react';
import { PoliticiansDatabase } from '../../components/figurat-politike/PoliticiansDatabase';

export default function FiguratPolitikePage() {
  return (
    <main className="min-h-screen py-6 px-2 sm:px-4">
      <PoliticiansDatabase />
    </main>
  );
}
