"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddAdminPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');
  const [adminCredentials, setAdminCredentials] = useState('');
  const [adminPhoto, setAdminPhoto] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!adminName || !adminCredentials || !adminPhoto || !adminEmail) {
        setErrorMessage('All fields are required.');
        setLoading(false);
        return;
    }

    // Check for duplicate entries
    const adminsRef = collection(db, 'admins');
    const snapshot = await getDocs(adminsRef);
    const existingAdmins = snapshot.docs.map((doc) => doc.data() as { email: string; credentials: string; });


    const isDuplicate = existingAdmins.some(admin => 
        admin.email === adminEmail || admin.credentials === adminCredentials
    );

    if (isDuplicate) {
        setErrorMessage('An admin with the same email or credentials already exists.');
        setLoading(false);
        return;
    }

    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!adminName || !adminCredentials || !adminPhoto || !adminEmail) {
      setErrorMessage('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const adminsRef = collection(db, 'admins');
      await addDoc(adminsRef, { 

        name: adminName,
        credentials: adminCredentials,
        photo: adminPhoto,
        email: adminEmail,
      });
      setSuccessMessage('Admin added successfully!');
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage('Failed to add admin. Please try again.');
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
        setAdminPhoto(`public/images/${fileName}`); // Set the file path in the admin photo URL field
      }
    };
    input.click();
  };

  return (
    <div className="bg-gray-100 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Admin Name"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Admin Credentials"
            value={adminCredentials}
            onChange={(e) => setAdminCredentials(e.target.value)}
            required
          />
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Photo URL"
              value={adminPhoto}
              onChange={(e) => setAdminPhoto(e.target.value)}
              required
            />
            <Button type="button" onClick={handleUploadClick} className="ml-2">
              Upload Image
            </Button>
          </div>
          <Input
            type="email"
            placeholder="Email ID"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition">
            {loading ? 'Adding...' : 'Add Admin'}
          </Button>
        </form>
        {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
      </div>
    </div>
  );
}
