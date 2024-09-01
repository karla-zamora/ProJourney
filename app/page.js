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
  
  const onSubmit = async () => {
    if (!user) {
      console.error("User is not signed in");
      return;
    }
    const data = {
      question: `
        Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

        You may assume that each input would have exactly one solution, and you may not use the same element twice.

        You can return the answer in any order.

        

        Example 1:

        Input: nums = [2,7,11,15], target = 9
        Output: [0,1]
        Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
        Example 2:

        Input: nums = [3,2,4], target = 6
        Output: [1,2]
        Example 3:

        Input: nums = [3,3], target = 6
        Output: [0,1]
        

        Constraints:

        2 <= nums.length <= 104
        -109 <= nums[i] <= 109
        -109 <= target <= 109
        Only one valid answer exists.`,
      answer: `
        function twoSum(nums, target) {
            const map = new Map();
            for (let i = 0; i < nums.length; i++) {
                const complement = target - nums[i];
                if (map.has(complement)) {
                    return [map.get(complement), i];
                }
                map.set(nums[i], i);
            }
        }`,
      spaceComplexity: 'O(n)',
      timeComplexity: 'O(n)',
      difficulty: 'Easy',
      tags: { Array: true, 'Hash Table': true, 'Linked Lists': false, 'Two Pointers': false },
    };

    try {
      const token = await user.getIdToken(); // Fetch the Firebase JWT from the authenticated user
      const response = await fetch('/api/create-algorithm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the JWT in the request headers
        },
        body: JSON.stringify(data),
      });

      // Log the response status and text
      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Attempt to parse the response as JSON
      const responseData = JSON.parse(responseText);
      console.log('Success:', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
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
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-8 sm:w-full">
          <button 
            className="bg-sky-400"
            onClick={onSubmit}
          >
            Submit Algorithm
          </button>
        </div>
      </main>

    </div>
  );
}