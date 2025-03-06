"use client";

import { Button } from 'components/ui/button';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from 'hooks/use-auth';

export function Navigation() { 
  const { user, logout } = useAuth();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">MockMaster</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about" className="text-gray-200 hover:text-gray-500">
              About
            </Link>
            <Link href="/pricing" className="text-gray-200 hover:text-gray-500">
              Pricing
            </Link>
            <Link href="/experts" className="text-gray-200 hover:text-gray-500">
              Our Experts
            </Link>
            {user ? (
              <>
              <Link href="/admin" className="text-gray-200 hover:text-gray-500">
                  Admin
                </Link>
                <Link href="/dashboard" className="text-gray-200 hover:text-gray-500">
                  Dashboard
                </Link>
                <Button variant="outline" onClick={() => logout()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
