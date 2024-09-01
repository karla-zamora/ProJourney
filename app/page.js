'use client';
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "./context/AuthContext";
import { auth } from "@/firebase";
import { useEffect } from "react";


export default function Home() {
  const { user, loading } = useAuth(); // Use the context to access and loading state

  
  const handleGoogleSignIn = async (e) => {
    const provider =  new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The AuthContext will automatically update because of the onAuthStateChanged listener
    } catch (error) {
      console.error("Error during sign-in: ", error);
      // Optionally, handle errors such as showing an error message to the user
    }
  };

  useEffect(() => {
    if(!loading && user) {
      console.log("User is signed in: ", user);
    }
  }, [loading, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">
        Welcome to ProJourney
      </h1>
      <button
        onClick={handleGoogleSignIn}
      >
        Sign In with Google
      </button>
    </main>
  );
}
