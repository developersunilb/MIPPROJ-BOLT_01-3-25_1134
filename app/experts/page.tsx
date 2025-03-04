"use client";

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image component
import { useAuth } from '../../hooks/use-auth'; // Import useAuth hook

// Define the type for expert objects
type Expert = {
  id: string;
  name: string;
  credentials: string;
  photo: string;
};

/**
 * ExpertsPage component
 *
 * This component renders a list of experts and allows the admin to select and delete experts.
 */
export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]); // Use the defined type
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]); // Track selected expert IDs
  const router = useRouter();
  const { user } = useAuth(); // Get the current user

  useEffect(() => {
    const fetchExperts = async () => {
      const expertsRef = collection(db, 'experts');
      const snapshot = await getDocs(expertsRef);
      const expertList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expert[];
      setExperts(expertList);
    };

    fetchExperts();
  }, []);

  /**
   * Handles the deletion of the selected experts.
   */
  const handleDeleteExperts = async () => {
    if (selectedExperts.length === 0) {
      alert("Please select at least one expert to delete.");
      return;
    }

    try {
      await Promise.all(selectedExperts.map(async (expertId) => {
        const expertDocRef = doc(db, 'experts', expertId);
        await deleteDoc(expertDocRef);
      }));
      // Refresh the expert list
      const expertsRef = collection(db, 'experts');
      const snapshot = await getDocs(expertsRef);
      const expertList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expert[];
      setExperts(expertList);
      setSelectedExperts([]); // Clear selected experts
    } catch (error) {
      console.error('Error deleting experts:', error);
      alert('Failed to delete experts. Please try again.'); // Set error message
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Our Experts
        </h1>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experts.map(expert => (
            <Card key={expert.id} className="p-4">
              {user && user.role === 'admin' && ( // Show checkboxes only for admin users
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedExperts.includes(expert.id)}
                    onChange={() => {
                      if (selectedExperts.includes(expert.id)) {
                        setSelectedExperts(selectedExperts.filter(id => id !== expert.id));
                      } else {
                        setSelectedExperts([...selectedExperts, expert.id]);
                      }
                    }}
                  />
                  <span className="ml-2">{expert.name}</span>
                </label>
              )}
              <p>{expert.credentials}</p>
              <Image 
                src={expert.photo} 
                alt={expert.name} 
                width={128} 
                height={128} 
                className="mt-2 object-cover" 
              />
            </Card>
          ))}
        </div>
        {user && user.role === 'admin' && ( // Show delete button only for admin users
          <Button onClick={handleDeleteExperts} className="mt-4" disabled={selectedExperts.length === 0}>
            Delete Selected Experts
          </Button>
        )}
      </div>
    </div>
  );
}
