'use client';
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "./context/AuthContext";
import { auth } from "@/firebase";
import { useEffect } from "react";


export default function Home() {
  const { user, loading, setRedirect } = useAuth(); // Use the context to access and loading state

  
  const handleGoogleSignIn = async (e) => {
    const provider =  new GoogleAuthProvider();
    try {
      
      // Set the desired redirect path before succesfully signing in, so when user state is updated, they will be redirected to the correct path
      setRedirect("/dashboard");
      // The AuthContext will automatically update because of the onAuthStateChanged listener
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in: ", error);
      // Optionally, handle errors such as showing an error message to the user
      // reset the redirect path to default path if the sign-in fails
      setRedirect(null);

    }
  };

  useEffect(() => {
    if(!loading && user) {
      console.log("User is signed in: ", user);
    }
    if(!loading && !user) {
      console.log("User is signed out");
    }
  }, [loading, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">
        Welcome to ProJourney
      </h1>
      { user ? (
        <button 
          className="bg-sky-400" 
          onClick={() => {
            setRedirect("/dashboard");
          }}
        >
          Dashboard
        </button>
      ) : (
        <button
          className="bg-sky-400"
          onClick={handleGoogleSignIn}
        >
          Sign In with Google
        </button>

      )}
    </main>
  );
}
