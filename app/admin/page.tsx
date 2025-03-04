"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../hooks/use-auth';
import TimeSlotModal from '../add-experts/TimeSlotModal';

type Expert = {
  id: string;
  name: string;
  credentials: string;
  photo: string;
};

/**
 * The AdminPage component is responsible for rendering the admin dashboard.
 * It fetches the list of existing experts from Firestore and displays them in a list.
 * The user can select multiple experts to delete.
 * The component also renders a form for adding a new expert.
 * 
 * @remarks
 * - Uses the "useAuth" hook to get the user's role.
 * - Uses the "useRouter" hook to navigate to the dashboard.
 * - Utilizes the "collection" and "addDoc" functions from Firestore to add new experts.
 * - Utilizes the "doc" and "deleteDoc" functions from Firestore to delete selected experts.
 * - Utilizes the "getDocs" function from Firestore to fetch the list of existing experts.
 */
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
    /**
     * Fetches the list of existing experts from Firestore.
     * 
     * @remarks
     * - Utilizes the "getDocs" function from Firestore.
     */
    const fetchExperts = async () => {
      const expertsRef = collection(db, 'experts');
      const snapshot = await getDocs(expertsRef);
      const expertList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expert[];
      setExistingExperts(expertList);
    };
    fetchExperts();
  }, []);

  /**
   * Handles the form submission for adding a new expert.
   * 
   * This function validates input fields and checks for duplicate expert entries.
   * If the input is valid and no duplicates are found, it adds the expert to the 
   * Firestore database and redirects the user to the dashboard upon successful addition.
   * 
   * @param e - The form event triggered on submission.
   * 
   * @remarks
   * - Sets loading state to true at the start and false at completion.
   * - Displays error messages for missing fields or duplicates.
   * - Utilizes Firestore to store expert data.
   * 
   * @throws Will set an error message if the expert addition to Firestore fails.
   */
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
