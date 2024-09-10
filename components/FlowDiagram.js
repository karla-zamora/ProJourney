"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProblemList from "@/components/ProblemList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"; // Import dialog components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactFlow, useReactFlow } from "reactflow"; // Correct imports from reactflow
import "reactflow/dist/style.css"; // Correct style import for reactflow
import { Button } from "@/components/ui/button";

export default function FlowDiagram({ problems }) {
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

  const filteredProblems = problems.filter(
    (problem) =>
      selectedNode &&
      selectedNode.data.topics &&
      selectedNode.data.topics.some((topic) => problem.tags.includes(topic))
  );

  const navigateToIde = (problemName) => {
    router.push(`/ide?name=${encodeURIComponent(problemName)}`);
  };

  return (
    <Card className="w-full md:w-7/12 bg-gray-900 text-white overflow-auto border min-h-[300px] scrollbar-hide">
      <CardHeader className="p-4 flex justify-between flex-row">
        <CardTitle className="text-2xl">Learning Path</CardTitle>
        <button
          class="mr-2 mb-2 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded flex flex-row"
          onClick={toggleFlowOpen}
        >
          {flowOpen ? "List View" : "Flow View"}
        </button>
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-4rem)]">
        {flowOpen ? (
          <>
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
                    {selectedNode
                      ? selectedNode.data.label
                      : "Node Information"}
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
                        {problems.length > 0 && (
                          <ProblemList
                            problems={filteredProblems}
                            onProblemClick={navigateToIde}
                          />
                        )}
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
          <>
            {problems.length > 0 && (
              <ProblemList problems={problems} onProblemClick={navigateToIde} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
