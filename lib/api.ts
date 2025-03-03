import { db } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function getUserAppointments(userId: string) {
  const appointmentsRef = collection(db, 'appointments');
  const q = query(appointmentsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function cancelAppointment(appointmentId: string) {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appointmentRef, { status: 'cancelled' });
}
