// /app/FlowDiagram/page.js

"use client";

import React, { useEffect, useRef } from "react";
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
  { id: "2", data: { label: "Array & String" }, position: { x: 100, y: 100 } },
  { id: "3", data: { label: "Binary Search" }, position: { x: 400, y: 100 } },
  {
    id: "4",
    data: { label: "Dynamic Programming" },
    position: { x: 300, y: 250 },
  },
  { id: "5", data: { label: "Two Pointers" }, position: { x: 50, y: 250 } },
  { id: "6", data: { label: "Sliding Window" }, position: { x: 150, y: 300 } },
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

const dailyData = [
  { day: "Mon", algorithms: 4 },
  { day: "Tue", algorithms: 3 },
  { day: "Wed", algorithms: 5 },
  { day: "Thu", algorithms: 2 },
  { day: "Fri", algorithms: 4 },
  { day: "Sat", algorithms: 6 },
  { day: "Sun", algorithms: 3 },
];

const performanceData = [
  { subject: "Problem Solving", A: 120, fullMark: 150 },
  { subject: "Communication", A: 98, fullMark: 150 },
  { subject: "Collaboration", A: 86, fullMark: 150 },
  { subject: "Coding", A: 99, fullMark: 150 },
  { subject: "Understanding", A: 85, fullMark: 150 },
  { subject: "Professionalism", A: 65, fullMark: 150 },
];

function FlowDiagram() {
  const { fitView } = useReactFlow(); // Correctly use the hook within the provider

  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.2 }); // Adjust view on resize
    };

    // Call fitView initially on mount
    fitView({ padding: 0.2 });

    // Attach resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, [fitView]);

  const handleNodeClick = (event, node) => {
    console.log("Clicked node:", node);
  };

  return (
    <Card className="w-full md:w-1/2 bg-gray-900 text-white overflow-hidden min-h-[300px]">
      <CardHeader className="p-4">
        <CardTitle>Learning Path</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
          onNodeClick={handleNodeClick}
          style={{ width: "100%", height: "100%" }}
        />
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-pink-700 to-blue-800 p-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Algorithm Learning Dashboard
      </h1>
      <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-4">
        <FlowDiagram />
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <Card className="flex-1 bg-gray-900 text-white overflow-hidden min-h-[300px]">
            <CardHeader className="p-4">
              <CardTitle>Daily Algorithms Completed</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
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
          <Card className="flex-1 bg-gray-900 text-white overflow-hidden min-h-[300px]">
            <CardHeader className="p-4">
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-4rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="#444" />
                  <PolarAngleAxis dataKey="subject" stroke="#E0E7FF" />
                  <PolarRadiusAxis stroke="#E0E7FF" />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
