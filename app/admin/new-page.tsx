"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import TimeSlotModal from '../add-experts/TimeSlotModal'; // Import the TimeSlotModal component

// Define the type for expert objects
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
  const [availability, setAvailability] = useState<string[]>([]); // Changed to an array to store multiple slots
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [existingExperts, setExistingExperts] = useState<Expert[]>([]); // Track existing experts
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]); // Track selected expert IDs

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

    // Validate input fields
    if (!expertName || !expertCredentials || !expertPhoto || availability.length === 0) {
      setErrorMessage('All fields are required.');
      setLoading(false);
      return;
    }

    // Check for duplicate entries
    const isDuplicate = existingExperts.some(expert => 
      expert.name === expertName || expert.credentials === expertCredentials
    );

    if (isDuplicate) {
      setErrorMessage('An expert with the same name or credentials already exists.');
      setLoading(false);
      return;
    }

    const expertData = {
      name: expertName,
      credentials: expertCredentials,
      photo: expertPhoto,
      availability: availability, // Directly use the array of slots
    };

    console.log('Expert Data:', expertData); // Log expert data for debugging

    try {
      const expertsRef = collection(db, 'experts');
      await addDoc(expertsRef, expertData);
      setSuccessMessage('Expert added successfully!'); // Set success message
      router.push('/dashboard'); // Redirect to dashboard after adding expert
    } catch (error) {
      console.error('Error adding expert:', error);
      setErrorMessage('Failed to add expert. Please try again.'); // Set error message
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileName = file.name; // Use file name
        setExpertPhoto(`\\images\\${fileName}`); // Set the file path in the expert photo URL field
      }
    };
    input.click();
  };

  const handleTimeSlotSelect = (slots: string[]) => {
    setAvailability(slots); // Set the selected time slots in the availability field
    setIsModalOpen(false); // Close the modal
  };

  const handleDeleteSelectedExperts = async () => {
    if (selectedExperts.length === 0) {
      alert("Please select at least one expert to delete.");
      return;
    }

    try {
      await Promise.all(selectedExperts.map(async (expertId) => {
        const expertDocRef = doc(db, 'experts', expertId);
        await deleteDoc(expertDocRef);
      }));
      setSuccessMessage('Selected experts deleted successfully!');
      setSelectedExperts([]); // Clear selected experts
      // Refresh the expert list
      const expertsRef = collection(db, 'experts');
      const snapshot = await getDocs(expertsRef);
      const expertList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expert[];
      setExistingExperts(expertList);
    } catch (error) {
      console.error('Error deleting experts:', error);
      setErrorMessage('Failed to delete experts. Please try again.'); // Set error message
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
  Admin Dashboard
</h1>
<div className="flex space-x-4 mt-4">
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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Expert Name"
            value={expertName}
            onChange={(e) => setExpertName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Expert Credentials"
            value={expertCredentials}
            onChange={(e) => setExpertCredentials(e.target.value)}
            required
          />
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Expert Photo URL"
              value={expertPhoto}
              onChange={(e) => setExpertPhoto(e.target.value)}
              required
            />
            <Button type="button" onClick={handleUploadClick} className="ml-2">
              Upload
            </Button>
          </div>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Available Time Slots (Comma separated)"
              value={availability.join(', ')} // Display selected slots as a comma-separated string
              readOnly
              className="mr-2"
            />
            <Button type="button" onClick={() => setIsModalOpen(true)}>
              Select
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="loader">Adding...</span> // Placeholder for loading spinner
            ) : (
              'Add Expert'
            )}
          </Button>
        </form>
        {successMessage && (
          <div className="mt-4 text-green-600">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-600">
            {errorMessage}
          </div>
        )}
        {user && user.role === 'admin' && ( // Show checkboxes and delete button only for admin users
          <div>
            {/* Render checkboxes for selecting experts */}
            {existingExperts.map(expert => (
              <div key={expert.id}>
                <label>
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
                  {expert.name}
                </label>
              </div>
            ))}
            <Button onClick={handleDeleteSelectedExperts}>Delete Selected Experts</Button>
          </div>
        )}
      </div>
      <TimeSlotModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleTimeSlotSelect} 
      />
    </div>
  );
}
