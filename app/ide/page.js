"use client";
import { useState, useEffect } from "react";
import MonacoEditorComponent from "@/components/MonacoEditorComponent";
import { useAuth } from "../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function Page() {
  const { user, loading, setRedirect } = useAuth(); // Use the context to access and loading state

  const [code, setCode] = useState(
    "# Write your code here\n#Framework of thinking: \n#Plan\n#Match\n#Implement\n#Review\n#Evaluate\n"
  );
  const [problemName, setProblemName] = useState("");
  const [description, setDescription] = useState("");
  const [examples, setExamples] = useState([]);
  const [output, setOutput] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState([]);
  const [constraints, setConstraints] = useState([]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const loadAlgorithm = async () => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    const algorithmName = "Check if two strings are anagrams";

    try {
      const token = await user.getIdToken(); // Fetch the Firebase JWT from the authenticated user

      const response = await fetch("/api/algorithms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT in the request headers
        },
        body: JSON.stringify({ algorithmName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      // console.log(result);
      setProblemName(result.question);
      setDescription(result.description);
      setExamples(result.examples);
      setDifficulty(result.difficulty);
      setConstraints(result.constraints);
      setTags(result.tags);
    } catch (error) {
      console.error("Error loading algorithm: ", error);
    }
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

  const handleGoogleSignIn = async (e) => {
    const provider = new GoogleAuthProvider();
    try {
      // Set the desired redirect path before succesfully signing in, so when user state is updated, they will be redirected to the correct path
      setRedirect("/ide");
      // The AuthContext will automatically update because of the onAuthStateChanged listener
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in: ", error);
      // Optionally, handle errors such as showing an error message to the user
      // reset the redirect path to default path if the sign-in fails
      setRedirect(null);
    }
  };

  const handleSignOut = async () => {
    try {
      // Set the redirect path to home before signing out, so when the user state is updated, they will be redirected to the correct path
      setRedirect("/");
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out: ", error);
      // If a user is not signed out successfully, reset the redirect path to default path
      setRedirect(null);
    }
  };

  useEffect(() => {
    loadAlgorithm();
  }, [loading, user]);

  useEffect(() => {
    if (!loading && user) {
      console.log("User is signed in ");
    }
    if (!loading && !user) {
      console.log("User is signed out");
    }
  }, [loading, user]);

  return (
    <>
      {user ? (
        <button className="bg-sky-400" onClick={handleSignOut}>
          Sign Out
        </button>
      ) : (
        <button className="bg-sky-400" onClick={handleGoogleSignIn}>
          Sign In with Google
        </button>
      )}
      <div className="grid grid-cols-2 gap-25 h-svh p-20">
        <div className="p-1">
          <div className="h-1/2 bg-cyan-950 text-white">
            <h1 className="text-2xl">Problem: Name {problemName}</h1>
            <p>Description: {description}</p>
            <p>Examples</p>
            <ul>
              {examples.map((example, index) => (
                <li key={index}>
                  <p>Input: {example.sampleInput}</p>
                  <p>Output: {example.sampleOutput}</p>
                  <p>Explanation: {example.explanation}</p>
                </li>
              ))}
            </ul>
            <p>Difficulty: {difficulty}</p>
            <p>Tags: {tags.join(", ")}</p>
            <p>Constraints</p>
            <ul>
              {constraints.map((constraint, index) => (
                <li key={index}>
                  <p>{constraint}</p>
                </li>
              ))}
            </ul>
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
    </>
  );
}
