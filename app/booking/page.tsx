"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Define the type for availability slots
type AvailabilitySlot = {
  id: string;
  startTime: string;
  endTime: string;
};

export default function BookingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]); // Use the defined type

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else {
      fetchAvailability();
    }
  }, [user, router]); // Include router in the dependency array

  const fetchAvailability = async () => {
    const expertId = new URLSearchParams(window.location.search).get('expertId');
    const availabilityRef = collection(db, 'availability');
    const q = query(availabilityRef, where('expertId', '==', expertId));
    const querySnapshot = await getDocs(q);
    const availableSlots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AvailabilitySlot[]; // Cast to AvailabilitySlot[]
    setAvailability(availableSlots);
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Available Appointment Slots
        </h1>
        {availability.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {availability.map(slot => (
              <li key={slot.id} className="p-4 border rounded-md">
                <p>{`Available from ${new Date(slot.startTime).toLocaleString()} to ${new Date(slot.endTime).toLocaleString()}`}</p>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                  Book Appointment
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-lg leading-8 text-gray-600">
            No available slots at the moment. Please check back later.
          </p>
        )}
      </div>
    </div>
  );
}
