"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarDays, Users, Video, MessageSquare } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const handleBookSession = () => {
    if (!user) {
      router.push('/auth');
    } else {
      router.push('/experts');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Ace Your Next Interview
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Practice with industry experts in real mock interviews. Get personalized feedback, 
            improve your skills, and boost your confidence.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="text-lg shadow-lg" onClick={handleBookSession}>
              Book a Mock Interview
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg shadow-lg bg-black text-white"
              onClick={() => router.push('/learn-more')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <CalendarDays className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book interviews at your convenience with our easy scheduling system
              </p>
            </Card>
            <Card className="p-6">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Interviewers</h3>
              <p className="text-gray-600">
                Practice with experienced industry professionals
              </p>
            </Card>
            <Card className="p-6">
              <Video className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Recorded Sessions</h3>
              <p className="text-gray-600">
                Review your performance with recorded interview sessions
              </p>
            </Card>
            <Card className="p-6">
              <MessageSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detailed Feedback</h3>
              <p className="text-gray-600">
                Get comprehensive feedback on your performance
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Book a Session</h3>
              <p className="text-gray-600">
                Choose your preferred time slot and interviewer
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Attend Interview</h3>
              <p className="text-gray-600">
                Join the video call and participate in the mock interview
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">Get Feedback</h3>
              <p className="text-gray-600">
                Receive detailed feedback and improvement suggestions
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}