'use client';
import { axiosFetchDoctor } from "@/lib/axiosConfig";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, Calendar, User, MessageCircle } from 'lucide-react'; 
import { toast } from "react-toastify";

export default function Page() {
  const [appointments, setAppointments] = useState([]);
  const[change ,setchange]=useState(false);
  const  name=localStorage.getItem('doctorname');
  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    axiosFetchDoctor(token)
      .get('/get-my-appointments')
      .then((response) => {
        
        setAppointments(response.data);  
        console.log(response.data);

      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
      });
  }, [change]);

  const deleteappointment=async(id:any)=>{
    const name=localStorage.getItem('doctorname');
    try{
      const token = localStorage.getItem("token") || "";
      const res=await axiosFetchDoctor(token).post("/update-appointment",{
        appointmentId:id,
        done:true,
        name
      })
      if(res.status==200){
        setchange(!change);
        toast.success("Appointment marked as completed");
      }
      else{
        toast.error("Some error while deleting");
      }
    }catch(err){
      console.log(err);
      toast.error("Error while deleting")  
    }
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-hidden">
      <div className="container mx-auto max-w-7xl w-full">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Appointments
          </h1>
          <div className="bg-white shadow-md rounded-full p-3">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <User className="mx-auto w-16 h-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No appointments available</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
            {appointments.map((appointment: any) => (
              <div
                key={appointment._id}
                className="bg-white rounded-2xl p-6 border border-gray-200 
                  shadow-lg hover:shadow-2xl transform hover:-translate-y-2 
                  transition-all duration-300 ease-in-out 
                  hover:border-blue-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{appointment.problem}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      {new Date(appointment.time).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    {appointment.patientId.length > 0 ? (
                      <p>Patient Name: {appointment.patientname}</p>
                    ) : (
                      <p>No patient assigned</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-500" />
                    {appointment.appointedDoctorId.length > 0 ? (
                      <p>Doctor: {name}</p>
                    ) : (
                      <p>No doctor assigned</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <Link
                    href={`/chat/doctor/${appointment._id}`}
                    className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 
                      text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 
                      transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Link>
                  <button 
                    onClick={() => deleteappointment(appointment._id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 
                      p-2 rounded-full transition-all duration-300 
                      focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}