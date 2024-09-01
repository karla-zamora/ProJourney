'use client';
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "./context/AuthContext";
import { auth } from "@/firebase";
import { useEffect } from "react";
import "../styles/home.css"
import AppBar from "@/components/AppBar.js"
import { Button } from '../components/ui/button';
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
        <h1 className="pb-32 text-6xl font-bold text-neutral-50 drop-shadow-lg">
          <span className="text-cyan-600 drop-shadow-lg">PRO</span><span className="text-slate-400 drop-shadow-lg	">Journey</span>
        </h1>


        <div class="grid sm:grid-cols-1 md:grid-cols-4 grid-flow-col gap-4 flex justify-evenly">
          <div>
            <div className="pb-5 md:col-span-1">
              <Card className="w-80 bg-black">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Next.js features and API.</CardDescription>
                </CardHeader>
                <CardContent>
                  Hello buenas
                </CardContent>
              </Card>
            </div>

            <div className="pb-5">
              <Card className="w-80">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Next.js features and API.</CardDescription>
                </CardHeader>
                <CardContent>
                  Hello buenas
                </CardContent>
              </Card>
            </div>

            <div className="pb-5">
              <Card className="w-80">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>Next.js features and API.</CardDescription>
                </CardHeader>
                <CardContent>
                  Hello buenas
                </CardContent>
              </Card>
            </div>
          </div>


          <div className="md:col-span-3">
            content????
          </div>
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