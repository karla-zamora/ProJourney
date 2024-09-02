'use client';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "./context/AuthContext";
import { auth } from "@/firebase";
import { useEffect } from "react";
import "../styles/home.css";
import trad_dsa from "@/public/images/trad_dsa_d.png";
import pro_dsa from "@/public/images/pro_dsa_d.png";
import AppBar from "@/components/AppBar.js";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

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
    <div className="main-pg min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <AppBar />
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-6 lg:px-8 text-center">
        <h4 className="font-bold text-neutral-50 drop-shadow-lg p-4">
          Welcome to your Computer Science
        </h4>
        <h1 className="card-shine-effect pb-16 text-6xl font-bold text-neutral-50 drop-shadow-lg">
          <span className="text-cyan-600 drop-shadow-lg">PRO</span>
          <span className="text-slate-400 drop-shadow-lg">Journey</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Card className="w-80 bg-transparent shadow-cyan-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-neutral-50 text-3xl">Repetition</CardTitle>
              <CardDescription className="text-neutral-400">Is the Key to Learning</CardDescription>
            </CardHeader>
            <CardContent className="text-neutral-50">
              With an algorithm designed to help you retain your past knowledge.
            </CardContent>
          </Card>

          <Card className="w-80 bg-transparent shadow-cyan-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-neutral-50 text-3xl">Customized</CardTitle>
              <CardDescription className="text-neutral-400">Learning Experience</CardDescription>
            </CardHeader>
            <CardContent className="text-neutral-50">
              With a program designed specifically for you.
            </CardContent>
          </Card>

          <Card className="w-80 bg-transparent shadow-cyan-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-neutral-50 text-3xl">Unlimited</CardTitle>
              <CardDescription className="text-neutral-400">Practice</CardDescription>
            </CardHeader>
            <CardContent className="text-neutral-50">
              Never lose your hard-earned programming skills.
            </CardContent>
          </Card>
        </div>

        {/* Images below the cards */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-neutral-50 pb-3">Master data structures & algorithms questions in a unique non-linear way.</h3>
          <Image src={trad_dsa} className="max-w-full lg:w-2/3 rounded-xl h-auto" />
          <Image src={pro_dsa} className="max-w-full lg:w-1/2 rounded-xl h-auto" />
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-8 sm:w-full">
          { user ? 
            (
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

            )
          }
        </div>
      </main>
    </div>
  );
}
