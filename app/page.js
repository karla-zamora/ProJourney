'use client';

import "../styles/home.css";
import MainPage from "@/components/MainPage";
import AppBar from "@/components/AppBar.js";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/firebase";
import { useEffect } from "react";

export default function Home() {
  // Auth
  const { user, loading, setRedirect } = useAuth(); // Use the context to access and loading state


  const handleGoogleSignIn = async (e) => {
    const provider = new GoogleAuthProvider();
    try {

      // Set the desired redirect path before succesfully signing in, so when user state is updated, they will be redirected to the correct path
      setRedirect("/FlowDiagram");
      // The AuthContext will automatically update because of the onAuthStateChanged listener
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in: ", error);
      // Optionally, handle errors such as showing an error message to the user
      // reset the redirect path to default path if the sign-in fails
      setRedirect(null);

    }
  };

  const handleSignOut = async () => {
    try {
      // Set the redirect path to home before signing out, so when the user state is updated, they will be redirected to the correct path
      setRedirect("/");
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out: ", error);
      // If a user is not signed out successfully, reset the redirect path to default path
      setRedirect(null);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      console.log("User is signed in: ", user);
    }
    if (!loading && !user) {
      console.log("User is signed out");
    }
  }, [loading, user]);

  return (
    <div className="main-pg min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <AppBar user={user} setRedirect={setRedirect} handleGoogleSignIn={handleGoogleSignIn} handleSignOut={handleSignOut}/>
      <MainPage user={user} setRedirect={setRedirect} handleGoogleSignIn={handleGoogleSignIn}/>
    </div>
  );
}