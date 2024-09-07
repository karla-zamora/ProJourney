"use client";
import broken_img from "@/public/images/broken.png";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import AppBar from "@/components/AppBar";

const pricingTiers = [
  {
    name: "Standard",
    price: 9.99,
    description: "For individuals starting their CS journey",
    features: [
      "Programming Language(s): Python",
      "Feature-rich code editor with syntax highlighting",
      "AI individualized learning path",
      "Easy, Medium, Hard problems",
      "Algorithm feedback",
    ],
    cta: "Start Standard Plan",
    ctaLink:
      "https://projourney.lemonsqueezy.com/buy/e822245f-9610-47c9-bac7-dbfa3fa75eac",
  },
  {
    name: "Premium",
    price: "Coming Soon",
    description: "For dedicated learners aiming for mastery",
    features: [
      "All Basic features",
      "AI voice coding assistant",
      "Improvement Suggestion Page",
      "Peer to peer code review",
      "Programming Language(s): Python, JavaScript, etc.",
    ],
    cta: "Join waitlist",
    highlight: true,
    comingSoon: true,
  },
];

export default function Services() {
  // Auth
  const { user, loading, setRedirect } = useAuth(); // Use the context to access and loading state
  const [showNotification, setShowNotification] = useState(false);

  const handleClick = (ctaLink) => {
    if (!user) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
      window.location.href = ctaLink;
    }
  };

  const handleGoogleSignIn = async (e) => {
    const provider = new GoogleAuthProvider();
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
    if (!loading && user) {
      console.log("User is signed in: ", user);
    }
    if (!loading && !user) {
      console.log("User is signed out");
    }
  }, [loading, user]);

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen">
      <AppBar
        user={user}
        setRedirect={setRedirect}
        handleGoogleSignIn={handleGoogleSignIn}
      />
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen overflow-x-hidden">
        <div id="top-page" className="w-full max-w-6xl">
          <h4 className="font-bold text-slate-200 opacity-75 drop-shadow-lg pt-4 text-indigo-950">
            Choose Your <span className="">Learning Path</span>
          </h4>
          <h1 className="pb-16 text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-50 drop-shadow-lg">
            <span className="shiny-text text-cyan-600 drop-shadow-lg">PRO</span>
            <span className="text-slate-400 drop-shadow-lg">Journey</span>
          </h1>
          <div className="mb-8 flex justify-center">
            <div className="text-neutral-50 italic bg-indigo-950 bg-opacity-25 rounded-xl p-3 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl">
              Master data structures & algorithms with our flexible pricing
              options
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className="w-96 bg-transparent shadow-cyan-50 shadow-lg"
              >
                <CardHeader>
                  <CardTitle
                    className={`text-4xl flex items-center space-x-4 ${
                      tier.highlight ? "text-cyan-300" : "text-neutral-50"
                    }`}
                  >
                    <span className="text-4xl">
                      {tier.name === "Standard" ? "🚀" : "💎"}
                    </span>
                    <span>{tier.name}</span>
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-neutral-50">
                  <div className="mb-4">
                    {tier.comingSoon ? (
                      <span className="text-2xl font-bold text-cyan-300">
                        {tier.price}
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">
                          ${tier.price}
                        </span>
                        <span className="text-sm">/month</span>
                      </>
                    )}
                  </div>
                  <ul className="space-y-2 mb-8 text-left">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      tier.highlight
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-cyan-600 hover:bg-cyan-700 text-white"
                    }`}
                    disabled={tier.comingSoon}
                    onClick={() => handleClick(tier.ctaLink)}
                  >
                    {tier.cta}
                  </Button>
                  {tier.name === "Standard" && showNotification && (
                    <p className="text-center mt-4 text-sm font-semibold text-rose-300">
                      You must be signed in to start the Standard Plan.
                    </p>
                  )}
                  {tier.comingSoon && (
                    <p className="text-center mt-4 text-sm font-semibold text-cyan-300">
                      Coming Soon!
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center py-10">
            <h1 className="text-4xl font-bold text-cyan-50 mb-6 animate-pulse">
              &#128640; Excited for our launch? &#128640;
            </h1>
            <Button
              asChild
              className="py-3 px-6 text-lg font-semibold text-white bg-rose-600 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-rose-700 hover:shadow-2xl hover:-translate-y-1"
            >
              <Link href="/waitlist">Join our Waitlist!</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
