"use client";
import { useState } from "react";
import MonacoEditorComponent from "@/components/MonacoEditorComponent";

export default function Page() {
  const [code, setCode] = useState("# Write your code here");
  const [output, setOutput] = useState("");

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    try {
      const response = await fetch("/api/submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: code,
          languageId: 92, // Python 3
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setOutput(result.stdout || result.stderr || "No output");
    } catch (error) {
      console.error("Error running code: ", error);
      setOutput("Error running code");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-25 h-svh p-20">
      <div className="p-1">
        <div className="h-1/2 bg-cyan-950 text-white">
          <h1 className="text-2xl">Problem: Name</h1>
          <p>Description: Description details here</p>
          <p>Input: someInput</p>
          <p>Output</p>
          <p>Sample Input</p>
          <p>Sample Output</p>
        </div>
        <div className="h-1/2">
          <h1>CodeEditor</h1>
          <MonacoEditorComponent
            value={code}
            language="python"
            onChange={handleEditorChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full"
            onClick={handleRunCode}
          >
            Run
          </button>
        </div>
      </div>
      <div className="p-1">
        <div className="h-1/2 bg-cyan-950 text-white">
          <h1 className="text-2xl">Output</h1>
          <pre className="overflow-auto h-full">{output}</pre>
        </div>
        <div className="h-1/2">
          <h1>Test Cases</h1>
          <div className="bg-cyan-950 text-white">
            <p>Test Case 1</p>
            <p>Test Case 2</p>
            <p>Test Case 3</p>
            <p>Test Case 4</p>
            <p>Test Case 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
