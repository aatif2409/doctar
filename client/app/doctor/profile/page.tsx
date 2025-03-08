"use client";

import React, { useEffect, useState } from 'react';
import { axiosFetchDoctor } from '@/lib/axiosConfig';
import { UserIcon, MailIcon, PhoneIcon, CalendarIcon, IdentificationIcon } from '@heroicons/react/outline';

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axiosFetchDoctor(token).get('/user-profile');
          setUser(response.data.user);
          setLoading(false);
        } else {
          setError('No token found.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen"><p>{error}</p></div>;
  }

  const getProfileImage = (gender: string) => {
    if (gender.toLowerCase() === 'male') {
      return 'https://static.vecteezy.com/system/resources/previews/024/183/502/original/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg';
    } else if (gender.toLowerCase() === 'female') {
      return 'https://static.vecteezy.com/system/resources/previews/004/899/680/non_2x/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg';
    }
  };

  return (
    <div className="w-[70rem] flex  min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg w-[80rem] rounded-lg p-8 flex flex-col items-center max-w-md  mx-auto">
        <img
          src={getProfileImage(user.gender)}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-6 object-cover"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Doctor Profile</h1>
        <div className="text-left w-full">
          <div className="flex items-center mb-3">
            <IdentificationIcon className="h-6 w-6 text-gray-500 mr-3" />
            <p><strong>Name:</strong> {user.name}</p>
          </div>
          <div className="flex items-center mb-3">
            <MailIcon className="h-6 w-6 text-gray-500 mr-3" />
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <div className="flex items-center mb-3">
            <PhoneIcon className="h-6 w-6 text-gray-500 mr-3" />
            <p><strong>Mobile:</strong> {user.mobile}</p>
          </div>
          <div className="flex items-center mb-3">
            <p><strong>Experience:</strong> {user.experience} years</p>
          </div>
          <div className="flex items-center mb-3">
            <p><strong>Specialization:</strong> {user.specialization}</p>
          </div>
          
          <div className="flex items-center mb-3">
            <UserIcon className="h-6 w-6 text-gray-500 mr-3" />
            <p><strong>Gender:</strong> {user.gender}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
