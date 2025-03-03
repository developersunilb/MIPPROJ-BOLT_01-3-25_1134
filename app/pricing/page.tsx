"use client";

import { Button } from '@/components/ui/button'; // Corrected import for Button
import { Check } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth'; // Corrected import for useAuth

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      router.push('/auth');
    } else {
      // In a real app, this would redirect to a payment page
      router.push('/payment');
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the perfect plan for your interview preparation needs
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Basic Plan */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Basic</h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Perfect for getting started with mock interviews
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">$49</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/session</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  45-minute mock interview
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Basic feedback report
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Interview recording
                </li>
              </ul>
            </div>
            <Button className="mt-8" onClick={handleGetStarted}>Get started</Button>
          </div>

          {/* Pro Plan */}
          <div className="flex flex-col justify-between rounded-3xl bg-gray-900 p-8 ring-1 ring-gray-900 xl:p-10">
            <div>
              <h3 className="text-lg font-semibold leading-8 text-white">Pro</h3>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                Comprehensive interview preparation package
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">$89</span>
                <span className="text-sm font-semibold leading-6 text-gray-300">/session</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-300">
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  60-minute mock interview
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Detailed feedback report
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Interview recording
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Written evaluation
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Follow-up Q&A
                </li>
              </ul>
            </div>
            <Button variant="secondary" className="mt-8" onClick={handleGetStarted}>
              Get started
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
            <div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Enterprise</h3>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Custom solutions for organizations
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">Custom</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Bulk interview packages
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Dedicated account manager
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  Custom reporting
                </li>
                <li className="flex gap-x-3">
                  <Check className="h-6 w-5 flex-none text-primary" />
                  API access
                </li>
              </ul>
            </div>
            <Button 
              variant="outline" 
              className="mt-8"
              onClick={() => router.push('/contact')}
            >
              Contact sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
