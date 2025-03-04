import { db } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

/**
 * Fetches the list of appointments for a specific user from Firestore.
 * 
 * @param userId - The ID of the user whose appointments are to be fetched.
 * @returns A promise that resolves to an array of appointment objects.
 * 
 * @remarks
 * - Utilizes Firestore to query appointments by userId.
 * - Maps each document in the query snapshot to an appointment object.
 */
export async function getUserAppointments(userId: string) {
  // Reference the 'appointments' collection in Firestore
  const appointmentsRef = collection(db, 'appointments');

  // Create a query to find appointments for the given userId
  const q = query(appointmentsRef, where('userId', '==', userId));

  // Execute the query and get the snapshot of documents
  const snapshot = await getDocs(q);

  // Map each document in the snapshot to an appointment object
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function cancelAppointment(appointmentId: string) {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appointmentRef, { status: 'cancelled' });
}
