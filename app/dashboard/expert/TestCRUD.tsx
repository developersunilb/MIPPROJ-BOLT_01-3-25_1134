"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../../../hooks/use-auth';

const TestCRUD = () => {
  const { createUserProfile, getUserProfile, updateUserProfile, deleteUserProfile, user } = useAuth();

  useEffect(() => {
    const testCRUDOperations = async () => {
      console.time('CRUD Operations');

      const userId = user?.uid || 'testUserId'; // Use the authenticated user's UID

      const profileData = { name: 'Test User', email: 'test@example.com', role: 'user' };

      // Log the user's authentication status and token
      console.log('Current User UID:', user?.uid); // Log the current user's UID
      console.log('User Object:', user); // Log the entire user object

      // Create user profile
      console.time('Create User Profile');
      await createUserProfile(userId, profileData);
      console.timeEnd('Create User Profile');

      // Read user profile
      console.time('Get User Profile');
      const userProfile = await getUserProfile(userId);
      console.timeEnd('Get User Profile');

      console.log('User Profile:', userProfile);

      // Update user profile
      const updatedProfileData = { name: 'Updated User', email: 'updated@example.com', role: 'user' };
      console.time('Update User Profile');
      await updateUserProfile(userId, updatedProfileData);
      console.timeEnd('Update User Profile');

      // Read updated user profile
      const updatedUserProfile = await getUserProfile(userId);
      console.log('Updated User Profile:', updatedUserProfile);

      // Delete user profile
      console.time('Delete User Profile');
      await deleteUserProfile(userId);
      console.timeEnd('Delete User Profile');

      console.log('User profile deleted.');
      console.timeEnd('CRUD Operations');
    };

    testCRUDOperations();
  }, [createUserProfile, getUserProfile, updateUserProfile, deleteUserProfile]);

  return <div>Testing CRUD operations...</div>;
};

export default TestCRUD;
