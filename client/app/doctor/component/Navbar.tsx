"use client"
import { useRouter } from "next/navigation";
const Navbar = () => {
  const navigate=useRouter();
  return (
    <nav className="fixed top-0  mb-5 left-0 w-full h-16 bg-amber-100 shadow-md flex items-center justify-between px-8 z-50">
      <div className="text-xl font-bold text-gray-500">Doctor Dashboard</div>
      <div className="flex space-x-6">
        <button  className="text-gray-700 hover:text-green-500 transition-colors duration-300" onClick={()=>{
          localStorage.removeItem("token")
        window.location.href="/"
        }}>Logout</button>
        <button className="text-gray-700 hover:text-green-500 transition-colors duration-300" onClick={()=>{
          navigate.push("/doctor/global-appointments")
        }}>
          Global Appointments
        </button>
        <button className="text-gray-700 hover:text-green-500 transition-colors duration-300"
         onClick={()=>{
           window.location.href="/doctor/patient-chats"
         }}
         >
          Patient Chats
        </button>
        <button className="text-gray-700 hover:text-green-500 transition-colors duration-300"
        onClick={()=>{
           window.location.href="/doctor/watch-reviews"
        }}
        >
          Watch Reviews
        </button>
        <button className="text-gray-700 hover:text-green-500 transition-colors duration-300"
        onClick={()=>{
          navigate.push("/doctor/profile")
        }}
        >
          Profile
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
