"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; // Import Image from next/image

type Admin = {
  id: string;
  name: string;
  credentials: string;
  photo: string;
  email: string;
};

export default function AdminListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsRef = collection(db, 'admins');
      const snapshot = await getDocs(adminsRef);
      const adminList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Admin[];
      setAdmins(adminList);
      setLoading(false);
    };

    if (user && user.email === 'developersunilb@gmail.com') {

      fetchAdmins();
    } else {
      router.push('/'); // Redirect if not an admin
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-10">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin List</h1>
        <ul className="space-y-4">
          {admins.map(admin => (
            <li key={admin.id} className="border-b pb-4">
              <h2 className="text-xl font-semibold">{admin.name}</h2>
              <p>Credentials: {admin.credentials}</p>
              <p>Email: {admin.email}</p>
              <Image src={admin.photo} alt={`${admin.name}'s photo`} width={64} height={64} className="rounded-full" />
            </li>
          ))}
        </ul>
        <Button onClick={() => router.push('/add-admin')} className="mt-4">
          Back to Add Admin
        </Button>
      </div>
    </div>
  );
}
