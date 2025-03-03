"use client";

import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);

  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  };

  return { toast, showToast };
}
