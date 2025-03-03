"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'; // Import necessary Firestore functions
import { Button } from '@/components/ui/button'; // Import Button component

type Expert = {
  id: string;
  name: string;
  credentials: string;
  photo: string;
};

type AvailabilitySlot = {
  id: string;
  startTime: string;
  endTime: string;
  expertId: string;
};

const BookSessionPage = () => {
  const { id } = useParams(); // Access the expert ID from the URL parameters
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    const fetchExpert = async () => {
      if (!id) return; // Ensure id is defined
      const expertRef = doc(db, 'experts', id as string); // Ensure id is treated as a string
      const expertSnapshot = await getDoc(expertRef);
      if (expertSnapshot.exists()) {
        setExpert({ id: expertSnapshot.id, ...expertSnapshot.data() } as Expert);
        // Fetch available slots for this expert
        const slotsRef = collection(db, 'availability');
        const slotsQuery = query(slotsRef, where('expertId', '==', id as string)); // Ensure id is treated as a string
        const slotsSnapshot = await getDocs(slotsQuery);
        const slots = slotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AvailabilitySlot[];
        setAvailableSlots(slots);
      } else {
        console.error('No such expert!');
      }
      setLoading(false);
    };

    fetchExpert();
  }, [id]);

  const handleBookSlot = (slotId: string) => {
    // Implement booking logic here
    console.log(`Booking slot with ID: ${slotId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{expert?.name}</h1>
      <h2>Available Time Slots</h2>
      <ul>
        {availableSlots.map(slot => (
          <li key={slot.id}>
            {slot.startTime} - {slot.endTime}
            <Button onClick={() => handleBookSlot(slot.id)}>Book</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSessionPage;
