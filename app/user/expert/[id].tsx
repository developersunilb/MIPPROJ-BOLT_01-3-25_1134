"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

const ExpertPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the expert ID from the URL
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpert = async () => {
      const expertRef = doc(db, 'experts', id);
      const expertSnapshot = await getDoc(expertRef);
      if (expertSnapshot.exists()) {
        setExpert({ id: expertSnapshot.id, ...expertSnapshot.data() });
      } else {
        console.error('No such expert!');
      }
      setLoading(false);
    };

    if (id) {
      fetchExpert();
    }
  }, [id]);

  const handleBookSession = () => {
    // Navigate to the booking page with the expert's ID
    router.push(`/book-session/${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{expert.name}</h1>
      <p>{expert.credentials}</p>
      <Button onClick={handleBookSession}>Book Session</Button>
      {/* Display available time slots here */}
    </div>
  );
};

export default ExpertPage;
