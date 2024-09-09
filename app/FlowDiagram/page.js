// /app/FlowDiagram/page.js

"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@/components/AppBar.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/firebase";
import { ReactFlow, useReactFlow } from "reactflow"; // Correct imports from reactflow
import "reactflow/dist/style.css"; // Correct style import for reactflow
import {
  Bar,
  BarChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"; // Import dialog components
import ProblemList from "@/components/ProblemList";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Roadmap from "../roadmap/roadmap";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "LeetCode 75 Topics" },
    position: { x: 250, y: 5 },
    style: {
      background: "#1E293B",
      color: "#E0E7FF",
      border: "2px solid #6366F1",
      borderRadius: "20px",
      fontWeight: "bold",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    },
  },
  // { id: "2", data: { label: "Array & String" }, position: { x: 100, y: 100 } },
  {
    id: "2",
    data: { label: "Strings & Arrays", topics: ["String", "Array"] },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "Binary Search", topic: ["Binary Search"] },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    data: { label: "Dynamic Programming", topic: ["Dynamic Programming"] },
    position: { x: 300, y: 250 },
  },
  {
    id: "5",
    data: { label: "Two Pointers", topic: ["Two Pointers"] },
    position: { x: 50, y: 250 },
  },
  {
    id: "6",
    data: { label: "Sliding Window", topic: ["Sliding Window"] },
    position: { x: 150, y: 300 },
  },
].map((node) => ({
  ...node,
  style: {
    background: "#0F172A",
    color: "#E0E7FF",
    border: "2px solid #0891B2",
    borderRadius: "20px",
    padding: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
}));

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#6366F1" },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#6366F1" },
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#6366F1" },
  },
  {
    id: "e2-5",
    source: "2",
    target: "5",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#6366F1" },
  },
  {
    id: "e2-6",
    source: "2",
    target: "6",
    type: "smoothstep",
    animated: true,
    style: { stroke: "#6366F1" },
  },
];

// const dailyData = [
//   { day: "Mon", algorithms: 4 },
//   { day: "Tue", algorithms: 3 },
//   { day: "Wed", algorithms: 5 },
//   { day: "Thu", algorithms: 2 },
//   { day: "Fri", algorithms: 4 },
//   { day: "Sat", algorithms: 6 },
//   { day: "Sun", algorithms: 3 },
// ];

const performanceData = [
  { subject: "Problem Solving", A: 120, fullMark: 150 },
  { subject: "Coding", A: 99, fullMark: 150 },
  { subject: "Understanding", A: 85, fullMark: 150 },
];

// Sample strengths and areas for improvement data
const strengths = [
  "Problem-solving skills are strong.",
  "Good collaboration with team members.",
  "Effective communication during presentations.",
];

const improvements = [
  "Improve time management skills.",
  "Enhance understanding of complex algorithms.",
  "Work on reducing coding errors.",
];

function FlowDiagram({ problems }) {
  const router = useRouter();
  const { fitView } = useReactFlow();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [flowOpen, setFlowOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 });
    };

    fitView({ padding: 0.2 });
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [fitView]);

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedNode(null);
  };

  const toggleFlowOpen = () => {
    setFlowOpen(!flowOpen);
  };

  // Filter problems based on the selected node's topics
  const filteredProblems = problems.filter(
    (problem) =>
      selectedNode &&
      selectedNode.data.topics &&
      selectedNode.data.topics.some((topic) => problem.tags.includes(topic))
  );

  // Define a function to handle navigation
  const navigateToIde = (problemName) => {
    router.push(`/ide?name=${encodeURIComponent(problemName)}`);
  };

  return (
    <Card className="w-full md:w-7/12 bg-gray-900 text-white overflow-auto border min-h-[300px] scrollbar-hide">
      <CardHeader className="p-4 flex justify-between flex-row">
        <CardTitle className="text-2xl">Learning Path</CardTitle>
        <button class="mr-2 mb-2 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded flex flex-row" onClick={toggleFlowOpen}>
            {flowOpen ? "List View" : "Flow View"}
        </button>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        {flowOpen ?
          (<>
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              fitView
              onNodeClick={handleNodeClick}
              style={{ width: "100%", height: "100%" }}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
                <DialogHeader className="border-b border-gray-700 pb-4 mb-4">
                  <DialogTitle className="text-2xl font-bold text-indigo-400">
                    {selectedNode ? selectedNode.data.label : "Node Information"}
                  </DialogTitle>
                  <DialogDescription className="text-base text-gray-400">
                    {selectedNode ? (
                      <div className="space-y-4">
                        <p>
                          <strong>Node Label:</strong> {selectedNode.data.label}
                        </p>
                        <p>
                          <strong>Node ID:</strong> {selectedNode.id}
                        </p>
                        <ProblemList
                          problems={filteredProblems}
                          onProblemClick={navigateToIde}
                        />
                      </div>
                    ) : (
                      "No node selected."
                    )}
                  </DialogDescription>
                </DialogHeader>
                <DialogClose asChild>
                  <Button className="mt-6 w-full bg-indigo-600 text-white hover:bg-indigo-700">
                    Close
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </>
          ) : (
            <ProblemList 
              problems={problems}
              onProblemClick={navigateToIde}
            />
          )}
      </CardContent>
    </Card>
  );
}

function StrengthsAndImprovements() {
  return (
    <Card className="flex-1 bg-gray-900 border text-white scrollbar-hide overflow-scroll min-h-[200px]">
      <CardHeader className="p-4">
        <CardTitle className="text-xl">
          Strengths and Areas for Growth
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row p-x-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Strengths</h3>
          <ul className="list-disc pl-5 space-y-1">
            {strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">
            Areas for Improvement
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {improvements.map((improvement, index) => (
              <li key={index}>{improvement}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  // Auth
  const { user, loading, setRedirect } = useAuth(); // Use the context to access and loading state
  const [algorithms, setAlgorithms] = useState([]);
  // Daily data for the BarChart
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

  const loadWeeklyData = () => {
    // Process algorithms to calculate the number of algorithms completed per day
    const updatedDailyData = [
      { day: "Mon", algorithms: 0 },
      { day: "Tue", algorithms: 0 },
      { day: "Wed", algorithms: 0 },
      { day: "Thu", algorithms: 0 },
      { day: "Fri", algorithms: 0 },
      { day: "Sat", algorithms: 0 },
      { day: "Sun", algorithms: 0 },
    ];

    algorithms.forEach((algorithm) => {
      // Using local time zone settings to determine the day of the week
      const completedDate = new Date(algorithm.inserted_at);
      const dayOfWeek = completedDate.toLocaleDateString(undefined, {
        weekday: "short",
      });

      // Find the corresponding day in updatedDailyData and increment the count
      const dayData = updatedDailyData.find((day) => day.day === dayOfWeek);
      if (dayData) {
        dayData.algorithms += 1;
      }
    });

    console.log("Updated Daily Data: ", updatedDailyData);

    setDailyData(updatedDailyData);
  };

  const getAlgorithms = async () => {
    const token = await user.getIdToken(); // Get the user's ID token
    const algorithmsResponse = await fetch("/api/get-algorithms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass the ID token in the Authorization header
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

    const submissionData = await userSubmissionsResponse.json();

    console.log("UserSubmissionResponse: ", submissionData);
    console.log("Submission Data: ", submissionData.submissions);

    const algorithmData = await algorithmsResponse.json();
    console.log("AlgorithmsResponse: ", algorithmData);
    console.log("Algorithm Data: ", algorithmData.algorithms);

    // Process the data and set the state
    const processedData = [];

    algorithmData.algorithms.map((algorithm, index) => {
      // Check if the algorithm is completed by the user
      const isCompleted = submissionData.submissions.some(
        (submission) =>
          submission.algorithm_id === algorithm.id && submission.passed === true
      );

      processedData.push({
        id: index,
        name: algorithm.question,
        difficulty: algorithm.difficulty,
        tags: algorithm.tags,
        completed: isCompleted,
        description: algorithm.description,
        inserted_at: algorithm.inserted_at,
      });
    });

    setAlgorithms(processedData);

    loadWeeklyData();
  };
  useEffect(() => {
    if (!loading && user) {
      console.log("User is signed in: ", user);
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
          {/* Left side: FlowDiagram */}
          <FlowDiagram problems={algorithms} />

          {/* Right side: Strengths and Improvements, Overall Performance, Daily Algorithms */}
          <div className="w-full md:w-5/12 flex flex-col gap-4 h-full">
            <StrengthsAndImprovements className="flex-1 min-h-[200px]" />
            <Card className="flex-1 bg-gray-900 border text-white overflow-hidden min-h-[200px]">
              <CardHeader className="p-4">
                <CardTitle className="text-xl">Overall Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-4rem)]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="subject" stroke="#E0E7FF" />
                    {/* <PolarRadiusAxis stroke="#E0E7FF" /> */}
                    <Radar
                      name="Performance"
                      dataKey="A"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.6}
                      dot={{
                        r: 4,
                        fillOpacity: 1,
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="flex-1 bg-gray-900 border text-white overflow-hidden min-h-[200px]">
              <CardHeader className="p-4">
                <CardTitle className="text-xl">
                  Daily Algorithms Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-6rem)]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="day" stroke="#E0E7FF" />
                    <YAxis stroke="#E0E7FF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="algorithms" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
