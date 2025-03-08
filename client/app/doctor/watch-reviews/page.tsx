"use client";
import { axiosFetchDoctor } from "@/lib/axiosConfig";
import { useState, useEffect } from "react";

export default function Page() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axiosFetchDoctor(token).get("/get-my-reviews");

        console.log(response.data);

        setReviews(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Error fetching reviews. Please try again.");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Doctor Reviews</h1>
    {reviews.length === 0 ? (
      <p className="text-gray-600">No reviews available.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {review.patientName}
              </h2>
              <div className="flex items-center">
                <span className="text-gray-600 text-sm">Rating:</span>
                <span className="ml-2 font-bold text-yellow-500">
                  {review.rate} / 5
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-2">{review.comment || "No comment provided."}</p>
            <p className="text-gray-600 italic">
              Problem: {review.problem || "No problem specified."}
            </p>
          </div>
        ))}
      </div>
    )}
  </div> 
  )
}
