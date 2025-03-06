"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, googleProvider, db } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import toast from 'react-hot-toast'; // Import react-hot-toast

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        try {
          // Fetch user role from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

          if (userDoc.exists()) {
            const userRole = userDoc.data()?.role;
            setUser({ ...currentUser, role: userRole }); // Merge currentUser with role
          } else {
            toast.error('User document not found in Firestore.');
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          toast.error('Failed to fetch user data.'); // Use react-hot-toast for errors
        }
      } else {
        setUser(null);
        setProfile(null);
        console.log('User is not authenticated.'); // Log when user is not authenticated
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createUserProfile = async (userId: string, profileData: any) => {
    try {
      await setDoc(doc(db, 'users', userId), profileData);
      toast.success('User profile created successfully!');
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Failed to create user profile.');
      throw error;
    }
  };

  const getUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        toast.error('User profile not found.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch user profile.');
      throw error;
    }
  };

  const updateUserProfile = async (userId: string, profileData: any) => {
    try {
      await updateDoc(doc(db, 'users', userId), profileData);
      toast.success('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update user profile.');
      throw error;
    }
  };

  const deleteUserProfile = async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success('User profile deleted successfully!');
    } catch (error) {
      console.error('Error deleting user profile:', error);
      toast.error('Failed to delete user profile.');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!'); // Use react-hot-toast for success
      return userCredential.user;
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to log in. Please check your credentials.'); // Use react-hot-toast for errors
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!'); // Use react-hot-toast for success
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to create account. Please try again.'); // Use react-hot-toast for errors
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Logged in with Google successfully!'); // Use react-hot-toast for success
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to log in with Google. Please try again.'); // Use react-hot-toast for errors
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!'); // Use react-hot-toast for success
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out. Please try again.'); // Use react-hot-toast for errors
      throw error;
    }
  };

  return {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    isExpert: profile?.role === 'expert',
  };
}