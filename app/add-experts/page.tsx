// This is the updated AddExpertsPage component with corrected TimeSlotModal implementation

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from 'lib/firebase'; // Corrected import path
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import { Button } from 'components/ui/button'; // Corrected import path
import { Input } from 'components/ui/input'; // Corrected import path
import { Textarea } from 'components/ui/textarea'; // Corrected import path
import { useAuth } from 'hooks/use-auth'; // Corrected import path
import TimeSlotModal from './TimeSlotModal'; // Import the TimeSlotModal component

// Define the type for expert objects
type Expert = {
  id: string;
  name: string;
  credentials: string;
  photo: string;
};

/**
 * The AddExpertsPage component is responsible for rendering a form that allows the user to add new experts.
 * It fetches the list of existing experts from Firestore and displays them in a list.
 * The user can select multiple experts to delete.
 * 
 * @remarks
 * - Uses the "useAuth" hook to get the user's role.
 * - Uses the "useRouter" hook to navigate to the dashboard.
 * - Utilizes the "collection" and "addDoc" functions from Firestore to add new experts.
 * - Utilizes the "doc" and "deleteDoc" functions from Firestore to delete selected experts.
 * - Utilizes the "getDocs" function from Firestore to fetch the list of existing experts.
 */
export default function AddExpertsPage() {
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check for missing fields
      if (!expertName || !expertCredentials || !expertPhoto) {
        setErrorMessage('Please fill in all fields.');
        setLoading(false);
        return;
      }

      // Check for duplicate expert entries
      const expertsRef = collection(db, 'experts');
      const snapshot = await getDocs(expertsRef);
      const existingExpert = snapshot.docs.find(doc => doc.data().name === expertName);

      if (existingExpert) {
        setErrorMessage('An expert with this name already exists.');
        setLoading(false);
        return;
      }

      // Add the expert to Firestore
      await addDoc(expertsRef, {
        name: expertName,
        credentials: expertCredentials,
        photo: expertPhoto,
        availability,
      });

      // Set success message and clear fields
      setSuccessMessage('Expert added successfully!');
      setErrorMessage('');
      setExpertName('');
      setExpertCredentials('');
      setExpertPhoto('');
      setAvailability([]);
      router.push('/dashboard');
    } catch (error) {
      // Handle errors
      console.error('Error adding expert:', error);
      setErrorMessage('Failed to add expert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Creates an input element, sets its type to "file", and accepts only images.
   * 
   * When the input element changes (i.e., when a file is selected), it gets the selected file,
   * extracts its name, and sets the expert photo URL to the file path with the name.
   * 
   * @remarks
   * - Utilizes the HTMLInputElement "files" property to get the selected file.
   * - Sets the expert photo URL to the file path with the selected file name.
   */
  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileName = file.name;
        setExpertPhoto(`\\images\\${fileName}`);
      }
    };
    input.click();
  };

  /**
   * Handles the time slot selection by closing the modal and setting the availability state to the selected time slots.
   * 
   * @param slots - The selected time slots.
   */
  const handleTimeSlotSelect = (slots: string[]) => {
    // Close the time slot modal
    setIsModalOpen(false);
    // Set the availability state to the selected time slots
    setAvailability(slots);
  };

  /**
   * Handles the deletion of selected experts.
   * 
   * This function deletes the selected experts from the Firestore database.
   * It first checks if at least one expert is selected, otherwise it shows an alert.
   * 
   * @remarks
   * - Deletes the selected experts from the Firestore database.
   * - Sets a success message if the deletion is successful.
   * - Sets an error message if the deletion fails.
   * 
   * @throws Will set an error message if the expert deletion from Firestore fails.
   */
  const handleDeleteSelectedExperts = async () => {
    // Check if at least one expert is selected
    if (selectedExperts.length === 0) {
      alert("Please select at least one expert to delete.");
      return;
    }

    try {
      // Delete the selected experts from Firestore
      await Promise.all(selectedExperts.map(async (expertId) => {
        const expertDocRef = doc(db, 'experts', expertId);
        await deleteDoc(expertDocRef);
      }));

      // Set a success message
      setSuccessMessage('Selected experts deleted successfully!');

      // Clear the selected experts
      setSelectedExperts([]);

      // Fetch the updated list of experts
      const expertsRef = collection(db, 'experts');
      const snapshot = await getDocs(expertsRef);
      const expertList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expert[];
      setExistingExperts(expertList);
    } catch (error) {
      console.error('Error deleting experts:', error);
      // Set an error message
      setErrorMessage('Failed to delete experts. Please try again.');
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Add Expert
        </h1>
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
              value={availability.join(', ')}
              readOnly
              className="mr-2"
            />
            <Button type="button" onClick={() => setIsModalOpen(true)}>
              Select
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="loader">Adding...</span>
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
        {user && user.role === 'admin' && (
          <div>
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
      <TimeSlotModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleTimeSlotSelect} />
    </div>
  );
}
