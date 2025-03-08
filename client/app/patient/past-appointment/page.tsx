"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { axiosFetchPatient } from "@/lib/axiosConfig";
import Link from "next/link";
export default function PastAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token: any = localStorage.getItem("token");
      const response = await axiosFetchPatient(token).get("/past-appointments");
      console.log(response.data);
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Past Appointments
      </h1>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No past appointments found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="relative bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 flex flex-col h-full"
            >
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Doctor: {appointment.doctorname || "Not Assigned"}
              </h2>
              <p className="text-gray-800 mb-3">{appointment.problem}</p>
              <div className="flex items-center mb-2 text-gray-600">
                <Calendar className="mr-2 h-5 w-5" />
                <span>{new Date(appointment.time).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center mb-4 text-gray-600">
                <Clock className="mr-2 h-5 w-5" />
                <span>{new Date(appointment.time).toLocaleTimeString()}</span>
              </div>
              <div className="inline-block bg-green-100 text-green-800 w-14 px-3 py-1 rounded-full text-sm font-medium">
                {appointment.progress}
              </div>
              {/* Review Button Positioned at the Bottom-Right */}
              <div className="absolute bottom-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition">
              <Link href={`review/${appointment._id}`}>
    <span>Review</span>
  </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
