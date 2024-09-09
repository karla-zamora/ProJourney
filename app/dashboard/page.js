"use client";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function Page() {
  const { user, loading, setRedirect } = useAuth();
  const name = user ? user.displayName : "";
  const email = user ? user.email : "";

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

  const handleGoogleSignIn = async (e) => {
    const provider = new GoogleAuthProvider();
    try {
      // Set the desired redirect path before succesfully signing in, so when user state is updated, they will be redirected to the correct path
      setRedirect("/dashboard");
      // The AuthContext will automatically update because of the onAuthStateChanged listener
      await signInWithPopup(auth, provider);
      console.log("Sign-in successful");
    } catch (error) {
      console.error("Error during sign-in: ", error);
      // Optionally, handle errors such as showing an error message to the user
      // reset the redirect path to default path if the sign-in fails
      setRedirect(null);
    }
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      {user ? (
        <button className="bg-sky-400" onClick={handleSignOut}>
          Sign Out
        </button>
      ) : (
        <button className="bg-sky-400" onClick={handleGoogleSignIn}>
          Sign In with Google
        </button>
      )}
    </div>
  );
}
