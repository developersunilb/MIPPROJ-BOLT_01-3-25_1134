"use client";

import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";

export function Navigation() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleBookSession = () => {
    if (!user) {
      router.push('/auth');
    } else {
      router.push('/experts');
    }
  };

  const handleDashboardClick = () => {
    if (!user) {
      router.push('/auth');
    } else if (profile?.role === 'expert') {
      router.push('/dashboard/expert');
    } else {
      router.push('/dashboard');
    }
  };

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
            <Link href="/about" className="text-gray-150 hover:text-gray-500">
              About
            </Link>
            <Link href="/pricing" className="text-gray-150 hover:text-gray-500">
              Pricing
            </Link>
            <Link href="/experts" className="text-gray-150 hover:text-gray-500">
              Our Experts
            </Link>
            <Link href="/learn-more" className="text-gray-150 hover:text-gray-500">
              Learn More
            </Link>
            {user && user.email === 'developersunilb@gmail.com' ? (
              <>
                <Link href="/admin" className="text-gray-150 hover:text-gray-500">
                  Admin
                </Link>
                <Button 
                  onClick={handleDashboardClick}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleLogout}>
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
                <Button onClick={handleBookSession}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
