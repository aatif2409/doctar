import React from "react";
import Link from "next/link";
import Navbar from "@/app/(components)/Navbar";
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar/>
   
        
      {/* About Section */}
      <section className="py-20 bg-white flex-1">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">About Us</h2>
          <p className="text-lg text-gray-600 mb-6">
            HealthX is a healthcare platform developed by a passionate team of Computer Science students. The project was created to bridge the gap between technology and healthcare, making medical services more accessible to everyone, anywhere. The core aim of HealthX is to provide a user-friendly platform where patients can connect with doctors in real-time, schedule appointments, and manage their health information effectively.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            The team behind HealthX consists of:
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; 2024 HealthX. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
