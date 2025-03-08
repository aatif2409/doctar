  "use client";

  import React, { useEffect, useState, useCallback } from "react";
  import { axiosFetchDoctor } from "@/lib/axiosConfig";

  const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [change, setChange] = useState(false);

    const fetchAppointments = useCallback(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found.");
        }
        const response = await axiosFetchDoctor(token).get("/get-all-appointments");
        console.log(response.data);
        
        setAppointments(response.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchAppointments();
    }, [fetchAppointments, change]);

    const treated = async (id) => {
      try {
        const token = localStorage.getItem("token")|| "";
        const res = await axiosFetchDoctor(token).post("/update-appointment", {
          appointmentId: id,
          done:false
        });
        if (res.status === 200) {
          setChange((prev) => !prev);
        }
      } catch (err) {
        console.error("Error updating appointment:", err);
      }
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
          <div className="text-lg font-medium text-red-500">{error}</div>
        </div>
      );
    }

    return (
      <div className="pt-12 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen w-full">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 mt-8">
          Upcoming Appointments
        </h1>
        <div className="container mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6 w-full">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">
                  {appointment.progress.charAt(0).toUpperCase()}
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{appointment.problem}</h2>
                  <p className="text-gray-600 text-sm mt-2">
                    <span className="font-medium">Patient Name:</span> {appointment.patientId.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Time:</span> {new Date(appointment.time).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-300"
                  onClick={() => treated(appointment._id)}
                >
                  Treat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Appointments;
