"use client";
import React, { useEffect, useState } from 'react';
import { axiosFetchPatient } from '@/lib/axiosConfig';
import { UserIcon, MailIcon, PhoneIcon, CalendarIcon, CakeIcon, IdentificationIcon } from '@heroicons/react/outline';

const UserProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token:any = localStorage.getItem("token");
        axiosFetchPatient(token).get('/user-profile').then((response)=>{
          setUser(response.data.user);
          setLoading(false);
        });
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
      return 'https://static.vecteezy.com/system/resources/previews/024/183/502/original/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg'; // Replace with the actual URL for the male avatar
    } else if (gender.toLowerCase() === 'female') {
      return 'https://static.vecteezy.com/system/resources/previews/004/899/680/non_2x/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg'; // Replace with the actual URL for the female avatar
    } 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center max-w-md w-full">
        <img
          src={getProfileImage(user.gender)}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-6 object-cover"
        />
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">User Profile</h1>
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
            <CakeIcon className="h-6 w-6 text-gray-500 mr-3" />
            <p><strong>Age:</strong> {user.age}</p>
          </div>
          <div className="flex items-center mb-3">
            <CalendarIcon className="h-6 w-6 text-gray-500 mr-3" />
            <p><strong>Date of Birth:</strong> {user.dob}</p>
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
