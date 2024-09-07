"use client";
import Workspace from "./Workspace";
import Navbar from "./components/NavBar";
import { useState, useEffect } from "react";
import MonacoEditorComponent from "@/components/MonacoEditorComponent";
import { useAuth } from "../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/firebase";

export default function Page() {
  const { user, loading, setRedirect } = useAuth(); // Use the context to access and loading state

  const [code, setCode] = useState(
    "# Write your code here\n#Framework of thinking: \n#Plan\n#Match\n#Implement\n#Review\n#Evaluate\n\n"
  );
  const [problemName, setProblemName] = useState("");
  const [description, setDescription] = useState("");
  const [examples, setExamples] = useState([]);
  const [output, setOutput] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [testCases, setTestCases] = useState([]);

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
      setTestCases(result.testCases);
      // Replace explicit \n with actual newlines
      const starterCode = (result.function_starter || "").replace(/\\n/g, "\n");
      const newCode = code + starterCode;
      setCode(newCode);
    } catch (error) {
      console.error("Error loading algorithm: ", error);
    }
  };

  const handleRunCode = async () => {
    console.log("handleRunCode called");
    console.log(code);
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
      // console.log(result);
      console.log("Output: \n", result.stdout || result.stderr || "No output");
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
      <div>
        <Navbar problemName={problemName} />
        <hr className="w-full" />
        <Workspace
          name={problemName}
          setName={setProblemName}
          desc={description}
          setDesc={setDescription}
          examples={examples}
          setExamples={setExamples}
          output={output}
          setOutput={setOutput}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          tags={tags}
          setTags={setTags}
          constraints={constraints}
          setConstraints={setConstraints}
          code={code}
          setCode={setCode}
          testCases={testCases}
          handleRunCode={handleRunCode}
        />
      </div>
    </>
  );
}
