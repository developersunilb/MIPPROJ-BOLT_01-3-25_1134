import { db } from './firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';

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
  const appointmentsRef = collection(db, 'appointments');
  const q = query(appointmentsRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export const getFeedback = async (userId: string) => {
    // Mock implementation of fetching feedback data
    return [
        {
            id: 1,
            title: "Great Interview!",
            comments: "You did an excellent job answering the questions.",
        },
        {
            id: 2,
            title: "Needs Improvement",
            comments: "Work on your body language and confidence.",
        },
    ];
};

export async function addAvailability(expertId: string, date: string, timeSlots: string[]) {
  const availabilityRef = collection(db, 'availability');
  await addDoc(availabilityRef, {
    expertId,
    date,
    timeSlots,
  });
}

export async function removeAvailability(expertId: string, date: string, timeSlot: string) {
  const availabilityRef = collection(db, 'availability');
  const q = query(availabilityRef, where('expertId', '==', expertId), where('date', '==', date), where('timeSlots', 'array-contains', timeSlot));
  const snapshot = await getDocs(q);
  snapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
}

/**
 * Cancels an appointment in Firestore.
 * 
 * @param appointmentId - The ID of the appointment to be cancelled.
 */
export async function cancelAppointment(appointmentId: string) {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appointmentRef, { status: 'cancelled' });
}

/**
 * Reschedules an appointment in Firestore.
 * 
 * @param appointmentId - The ID of the appointment to be rescheduled.
 * @param newSlotId - The ID of the new time slot for the appointment.
 */
export async function rescheduleAppointment(appointmentId: string, newSlotId: string) {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appointmentRef, { slotId: newSlotId });
}

/**
 * Fetches available time slots for a specific expert.
 * 
 * @param expertId - The ID of the expert whose availability is to be fetched.
 * @returns A promise that resolves to an array of available time slots.
 */
export async function getExpertAvailability(expertId: string) {
  const availabilityRef = collection(db, 'availability');
  const q = query(availabilityRef, where('expertId', '==', expertId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}
