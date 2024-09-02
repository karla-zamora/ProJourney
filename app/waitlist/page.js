"use client";
import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [ideas, setIdeas] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // State to track message type

  const submitWaitlistForm = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior (which is GET)
    console.log("Email: ", email);
    console.log("Ideas: ", ideas);

    try {
      const response = await fetch("/api/upsert-waitlist", {
        method: "POST", // Ensure the method is POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, ideas }), // Send data in the request body
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Success: ", result);
        setMessage("Successfully added to waitlist!");
        setMessageType("success"); // Set message type to success
      } else {
        console.error("Error: ", result);
        setMessage("Error submitting form. Please try again.");
        setMessageType("error"); // Set message type to error
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      setMessage("Error submitting form. Please try again.");
      setMessageType("error"); // Set message type to error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Join Our Waitlist
        </h2>

        {/* Ensure the form's onSubmit event is properly handled */}
        <form onSubmit={submitWaitlistForm}>
          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Ideas/Suggestions Box */}
          <div className="mb-4">
            <label
              htmlFor="suggestions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ideas / Suggestions
            </label>
            <textarea
              id="suggestions"
              name="suggestions"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Share your thoughts with us"
              value={ideas}
              onChange={(e) => setIdeas(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 text-sm rounded-lg ${
              messageType === "success"
                ? "bg-green-100 text-green-600" // Green for success
                : "bg-red-100 text-red-600" // Red for error
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
