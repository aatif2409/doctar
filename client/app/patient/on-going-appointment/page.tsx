"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { axiosFetchPatient } from "@/lib/axiosConfig";
import Link from "next/link";

export default function OngoingAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      axiosFetchPatient(token)
        .get("/get-patient-appointments")
        .then((response) => {
          console.log(response.data);
          const data = response.data;
          setAppointments(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
          console.log(error);
        });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center border-b-2 pb-4 border-gray-200">
        Ongoing Appointments
      </h1>
      {appointments.length === 0 ? (
        <p className="text-gray-500 text-center text-lg mt-4">
          No ongoing appointments found.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300 transform hover:scale-105 border-t-4 border-green-500"
            >
              <h2 className="text-xl font-semibold mb-3 text-gray-700">
                Doctor: {appointment.doctorName || "Not Assigned"}
              </h2>
              <p className="text-gray-600 mb-4 font-medium">
                {appointment.problem}
              </p>
              <div className="flex items-center mb-4 text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                  <span>
                    {new Date(appointment.time).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-400" />
                  <span>
                    {new Date(appointment.time).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold inline-block bg-${
                    appointment.progress === "ongoing" ? "green" : "yellow"
                  }-100 text-${
                    appointment.progress === "ongoing" ? "green" : "yellow"
                  }-700`}
                >
                  {appointment.progress}
                </span>
                <Link
                  href={`/chat/patient/${appointment._id}`}
                  className="text-blue-500 hover:underline font-semibold"
                >
                  Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
