"use client";
import React, { useEffect, useRef } from "react";
import { ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

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
      borderRadius: "20px", // More rounded corners
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
    borderRadius: "20px", // Increased border radius for rounded nodes
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

export default function Page() {
  // Handle node click event
  const handleNodeClick = (event, node) => {
    console.log("Clicked node:", node);
    // Add custom logic here, e.g., navigate to a new page or display node details
  };

  return (
    <div
      className=""
      style={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(115deg, #592d68, #8f5364, #1d4765)",
      }}
    >
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        style={{ width: "100%", height: "100%" }}
        fitView
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
