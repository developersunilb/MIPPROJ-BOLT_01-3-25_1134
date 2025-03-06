"use client";

import { useState } from 'react';

/**
 * Hook to display a toast notification.
 *
 * @returns An object with two properties:
 * - `toast`: The current toast notification, or `null` if no toast is being shown.
 * - `showToast`: A function to display a new toast notification.
 */
export function useToast() {
  const [toast, setToast] = useState<{ title: string; description: string; variant: 'default' | 'destructive' } | null>(null);

  /**
   * Show a toast notification.
   *
   * @param title The title of the toast notification.
   * @param description The description of the toast notification.
   * @param variant The variant of the toast notification. Defaults to `'default'`.
   */
  const showToast = (title: string, description: string, variant: 'default' | 'destructive' = 'default') => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
  };

  return { toast, showToast };
}
