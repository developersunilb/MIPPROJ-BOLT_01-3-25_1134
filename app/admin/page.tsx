"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import TimeSlotModal from '../add-experts/TimeSlotModal';

type Expert = {
  id: string;
  name: string;
  credentials: string;
  photo: string;
};

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [expertName, setExpertName] = useState('');
  const [expertCredentials, setExpertCredentials] = useState('');
  const [expertPhoto, setExpertPhoto] = useState('');
  const [availability, setAvailability] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [existingExperts, setExistingExperts] = useState<Expert[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);

  useEffect(() => {
    const fetchExperts = async () => {
      const expertsRef = collection(db, 'experts');
      const snapshot = await getDocs(expertsRef);
      const expertList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expert[];
      setExistingExperts(expertList);
    };
    fetchExperts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!expertName || !expertCredentials || !expertPhoto || availability.length === 0) {
      setErrorMessage('All fields are required.');
      setLoading(false);
      return;
    }

    const isDuplicate = existingExperts.some(expert => 
      expert.name === expertName || expert.credentials === expertCredentials
    );

    if (isDuplicate) {
      setErrorMessage('An expert with the same name or credentials already exists.');
      setLoading(false);
      return;
    }

    try {
      const expertsRef = collection(db, 'experts');
      await addDoc(expertsRef, {
        name: expertName,
        credentials: expertCredentials,
        photo: expertPhoto,
        availability,
      });
      setSuccessMessage('Expert added successfully!');
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage('Failed to add expert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Welcome to the Admin Dashboard</h1>
        <div className="flex space-x-4 mt-4">
         <Button onClick={() => router.push('/add-admin/list')} className="mt-4">
            View Admins list
          </Button> 
          <Button onClick={() => router.push('/add-admin')} className="mt-4">
            Add New Admins
          </Button>
          <Button onClick={() => router.push('/add-experts')} className="mt-4">
            Add Expert
          </Button>
          <Button onClick={() => {/* Future Google Analytics functionality */}} className="mt-4">
            Google Analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
