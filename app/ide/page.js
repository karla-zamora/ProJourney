"use client";
import { useState } from "react";

export default function Page() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

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
    <div>
      <h1>CodeEditor</h1>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Type your code here..."
        className="bg-slate-400 "
      />
      <button onClick={handleRunCode}>Run</button>
      <pre>{output}</pre>
    </div>
  );
}
