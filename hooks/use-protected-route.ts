"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

/**
 * useProtectedRoute
 *
 * This hook is used to protect routes that require user authentication. It checks
 * if the user is authenticated and redirects to the login page if not.
 */
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Loading:', loading); // Log loading state
    console.log('User:', user); // Log user state
    // If the user is not authenticated, redirect to the login page

    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);
}
