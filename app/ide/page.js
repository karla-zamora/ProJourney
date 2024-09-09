"use client";
import Workspace from "./Workspace";
import Navbar from "./components/NavBar";
import { useState, useEffect } from "react";
import MonacoEditorComponent from "@/components/MonacoEditorComponent";
import { useAuth } from "../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams(); // Access URL search parameters
  const problemNameFromUrl = searchParams.get("name"); // Retrieve the 'name' parameter from the URL

  // Define problemName as a state variable using useState
  const [problemName, setProblemName] = useState(problemNameFromUrl || ""); // Initialize with the URL parameter or an empty string

  const { user, loading, setRedirect } = useAuth(); // Use the context to access and loading state
  const [code, setCode] = useState(
    "# Write your code here\n#Framework of thinking: \n#Plan\n#Match\n#Implement\n#Review\n#Evaluate\n\n"
  );
  // const [problemName, setProblemName] = useState("");
  const [description, setDescription] = useState("");
  const [examples, setExamples] = useState([]);
  const [output, setOutput] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState([]);
  const [constraints, setConstraints] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [passedCases, setPassedCases] = useState([]);
  const [functionDef, setFunctionDef] = useState("");
  const [problemPassed, setProblemPassed] = useState(false);
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  // Ensure loadAlgorithm is called only when the user is loaded and authenticated
  useEffect(() => {
    if (!loading && user && problemNameFromUrl && !description) {
      loadAlgorithm(problemNameFromUrl);
    }
  }, [user, loading, problemNameFromUrl, description]);

  useEffect(() => {
    if (!loading && user && problemName) {
      loadAlgorithm(problemName);
    }
  }, [problemName, user, loading]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const loadAlgorithm = async (algorithmName) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    //const algorithmName = "Group anagrams from a list of strings";
    // const algorithmName = "Check if two strings are anagrams";

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
      // setProblemName(result.question);
      setDescription(result.description);
      setExamples(result.examples);
      setDifficulty(result.difficulty);
      setConstraints(result.constraints);
      setTags(result.tags);
      setTestCases(result.testCases);
      // Retrieve function name from function definition in db
      //setFunctionDef(result.function_def.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)/)[1]);
      setFunctionDef(result.function_def);
      setPassedCases(result.testCases.map((tc) => false));
      // Replace explicit \n with actual newlines
      const starterCode = (result.function_starter || "").replace(/\\n/g, "\n");
      const newCode = code + starterCode;
      setCode(newCode);
    } catch (error) {
      console.error("Error loading algorithm: ", error);
    }
  };

  // Format code to be run for each test case (adding calling function at the end with params)
  const formatTestCaseCode = (index) => {
    // Retrieve test case inputs
    const words = testCases[index].input;
    const cleanFunction = extractFunctionInfo(functionDef);
    var completeFunction = cleanFunction;
    if (completeFunction.includes("list")) {
      completeFunction = replaceListWithWords(cleanFunction, words);
    }
    if (completeFunction.includes("str")) {
      completeFunction = replaceStrWithWords(cleanFunction, words);
    }
    return completeFunction;
  };

  function extractFunctionInfo(functionDef) {
    // Capture the function name and parameters
    const regex = /def\s+(\w+)\s*\(([^)]*)\)\s*->\s*([^:]+):/;
    const match = functionDef.match(regex);

    if (match) {
      const funcName = match[1]; // Function name
      const params = match[2]; // Parameters

      // Extract parameter types including nested ones like list[list[str]]
      const paramTypes = params.split(",").map((param) => {
        const parts = param.split(":");
        return parts[1] ? parts[1].trim() : "";
      });

      return `${funcName}(${paramTypes.join(", ")})`;
    } else {
      return "Invalid function definition";
    }
  }
  // Function to replace the "str" with each word from the test case
  function replaceStrWithWords(cleanFunction, wordsArray) {
    let wordIndex = 0;
    return cleanFunction.replace(/\bstr\b/g, () => {
      if (wordIndex < wordsArray.length) {
        return "'" + wordsArray[wordIndex++] + "'"; // Replace with the current word and increment index
      } else {
        return "str"; // If the array runs out of words, keep "str"
      }
    });
  }

  // Function to replace the "list[something]" with the words array
  function replaceListWithWords(cleanFunction, wordsArray) {
    return cleanFunction.replace(/list\[.*?\]/, () => {
      // Join the wordsArray into a string with elements separated by commas and surrounded by single quotes
      const wordsString = wordsArray.map((word) => `'${word}'`).join(", ");
      return `[${wordsString}]`;
    });
  }

  useEffect(() => {
    if (isCodeRunning) {
      console.log("code running");
    }
  }, [isCodeRunning]);

  const handleRunCode = async () => {
    console.log("handleRunCode called");
    const runPassed = []; // Store passing test cases as they go
    for (const index in testCases) {
      const formattedCode =
        code + "\n" + "print(" + formatTestCaseCode(index) + ")";
      try {
        const response = await fetch("/api/submission", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceCode: formattedCode,
            languageId: 92, // Python 3
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        const currentOutput = result.stdout || result.stderr || "No output";
        setOutput((val) => [...val, currentOutput]);
        console.log(
          "Output: \n",
          result.stdout || result.stderr || "No output"
        );
        //console.log("output array: " + output)
        runPassed.push(handleTestCases(index, result.stdout));
      } catch (error) {
        console.error("Error running code: ", error);
        setOutput("Error running code");
      }
    }
    console.log("final runpassed: " + runPassed);
    setPassedCases(runPassed);
    setIsCodeRunning(false);
  };

  const handleTestCases = (index, currentOutput) => {
    // Normalize the expected and actual outputs
    const expectedOutput = testCases[index].expectedOutput
      .toString()
      .toLowerCase()
      .replace(/\n/g, "");
    const normalizedOutput = currentOutput
      .toString()
      .toLowerCase()
      .replace(/\n/g, "");
    return expectedOutput === normalizedOutput;
  };

  useEffect(() => {
    // if all test cases passed = problem passed
    if (passedCases.every(Boolean)) {
      setProblemPassed(true);
      console.log("Problem passed");
    }
  }, [passedCases]);

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

  // useEffect(() => {
  //   loadAlgorithm();
  // }, [loading, user]);

  useEffect(() => {
    if (!loading && user) {
      console.log("User is signed in ", user);
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
          passedCases={passedCases}
          handleTestCases={handleTestCases}
          isCodeRunning={isCodeRunning}
          setIsCodeRunning={setIsCodeRunning}
        />
      </div>
    </>
  );
}
