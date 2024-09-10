// /app/FlowDiagram/page.js

"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@/components/AppBar.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/firebase";
import Roadmap from "../roadmap/roadmap";
import StrengthsAndImprovements from "@/components/StrengthsAndImprovements";
import FlowDiagram from "@/components/FlowDiagram";
import Performance from "@/components/Performance";
import DailyAlgorithms from "@/components/DailyAlgorithms";

export default function Page() {
  const { user, loading, setRedirect } = useAuth(); // Use the context to access and loading state
  const [algorithms, setAlgorithms] = useState([]);
  const [algoSubmissions, setAlgoSubmissions] = useState([]);
  const [dailyData, setDailyData] = useState([
    { day: "Mon", algorithms: 0 },
    { day: "Tue", algorithms: 0 },
    { day: "Wed", algorithms: 0 },
    { day: "Thu", algorithms: 0 },
    { day: "Fri", algorithms: 0 },
    { day: "Sat", algorithms: 0 },
    { day: "Sun", algorithms: 0 },
  ]);

  const handleGoogleSignIn = async (e) => {
    const provider = new GoogleAuthProvider();
    try {
      setRedirect("/dashboard");
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in: ", error);
      setRedirect(null);
    }
  };

  const getAlgorithms = async () => {
    try {
      const token = await user.getIdToken();

      const algorithmsResponse = await fetch("/api/get-algorithms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!algorithmsResponse.ok) {
        console.error(
          "Error fetching algorithms: ",
          algorithmsResponse.statusText
        );
        return;
      }

      const userSubmissionsResponse = await fetch("/api/get-user-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid: user.uid }),
      });

      if (!userSubmissionsResponse.ok) {
        console.error(
          "Error fetching user submissions: ",
          userSubmissionsResponse.statusText
        );
        return;
      }

      const submissionsResults = await userSubmissionsResponse.json();
      const submissionData = submissionsResults.submissions;
      // console.log("Fetched Submissions: ", submissionData);

      if (!submissionData || submissionData.length === 0) {
        // console.log("No submissions found for the current user.");
      }

      setAlgoSubmissions(submissionData);

      const algorithmData = await algorithmsResponse.json();
      // console.log("Fetched Algorithms: ", algorithmData.algorithms);

      const processedData = algorithmData.algorithms.map((algorithm, index) => {
        const isCompleted = submissionData.some(
          (submission) => submission.algorithm_id === algorithm.id
        );

        return {
          id: index,
          name: algorithm.question,
          difficulty: algorithm.difficulty,
          tags: algorithm.tags,
          completed: isCompleted,
          description: algorithm.description,
          inserted_at: algorithm.inserted_at,
        };
      });

      // console.log("Setting algorithms: ", processedData);
      setAlgorithms(processedData);
      // console.log("Calling loadWeeklyData...");
      loadWeeklyData(submissionData); // Pass submissionData to loadWeeklyData
    } catch (error) {
      console.error("Error during data fetching: ", error);
    }
  };

  const loadWeeklyData = (submissions) => {
    // console.log("Loading weekly data...");
    // console.log("Algo Submissions: ", submissions);

    if (!submissions || !submissions.length) {
      // console.log("No submissions available.");
      return;
    }

    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const weekStart = new Date(currentDate);
    weekStart.setDate(
      currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1)
    );

    const updatedDailyData = [
      { day: "Mon", algorithms: 0 },
      { day: "Tue", algorithms: 0 },
      { day: "Wed", algorithms: 0 },
      { day: "Thu", algorithms: 0 },
      { day: "Fri", algorithms: 0 },
      { day: "Sat", algorithms: 0 },
      { day: "Sun", algorithms: 0 },
    ];

    const weeklySubmissions = submissions.filter((submission) => {
      const submissionDate = new Date(submission.submitted_at);
      return (
        // submissionDate >= weekStart &&
        // submissionDate <= currentDate &&
        submission.user_id === user.uid
      );
    });

    // console.log("Weekly Submissions: ", weeklySubmissions);

    weeklySubmissions.forEach((submission) => {
      const submissionDate = new Date(submission.submitted_at);
      const dayOfWeek = submissionDate.toLocaleDateString(undefined, {
        weekday: "short",
      });

      const dayData = updatedDailyData.find((day) => day.day === dayOfWeek);
      if (dayData) {
        dayData.algorithms += 1;
      }
    });

    // console.log("Updated Daily Data: ", updatedDailyData);
    setDailyData(updatedDailyData);
  };

  useEffect(() => {
    if (!loading && user) {
      // console.log("User is signed in: ", user);
      getAlgorithms();
    }
  }, [loading, user]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-800 via-pink-700 to-blue-800 p-4 overflow-auto">
      <AppBar
        user={user}
        setRedirect={setRedirect}
        handleGoogleSignIn={handleGoogleSignIn}
      />
      <div className="flex flex-col p-5">
        <h1 className="text-3xl font-bold mb-4 text-white w-full text-center">
          Algorithm Learning Dashboard
        </h1>
        <div className="flex flex-col md:flex-row h-[calc(100vh-10.5rem)] gap-4">
          <FlowDiagram problems={algorithms} />
          <div className="w-full md:w-5/12 flex flex-col gap-4 h-full">
            <StrengthsAndImprovements className="flex-1 min-h-[200px]" />
            <Performance />
            <DailyAlgorithms dailyData={dailyData} />
          </div>
        </div>
      </div>
    </div>
  );
}
