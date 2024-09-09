"use client";
import React, { useEffect, useState } from "react";
import Workspace from "./Workspace";
import Navbar from "./components/NavBar";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { auth } from "@/firebase";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import remarkGfm from "remark-gfm"; // Import for GitHub-flavored markdown support

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const problemNameFromUrl = searchParams.get("name");

  const [problemName, setProblemName] = useState(problemNameFromUrl || "");
  const { user, loading, setRedirect } = useAuth();
  const [code, setCode] = useState(
    "# Write your code here\n#Framework of thinking: \n#Plan\n#Match\n#Implement\n#Review\n#Evaluate\n\n"
  );
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

  // State for dialog visibility
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [geminiOutput, setGeminiOutput] = useState("This is not a quote");

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

  const loadAlgorithm = async (algorithmName) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/algorithms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ algorithmName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setDescription(result.description);
      setExamples(result.examples);
      setDifficulty(result.difficulty);
      setConstraints(result.constraints);
      setTags(result.tags);
      setTestCases(result.testCases);
      setFunctionDef(result.function_def);
      setPassedCases(result.testCases.map((tc) => false));
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

  const handleRunCode = async () => {
    console.log("handleRunCode called");
    setIsCodeRunning(true);
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
        runPassed.push(handleTestCases(index, result.stdout));
      } catch (error) {
        console.error("Error running code: ", error);
        setOutput("Error running code");
      }
    }
    setPassedCases(runPassed);
    setIsCodeRunning(false);
  };

  const generateText = async () => {
    const prompt =
      "Problem description: " +
      JSON.stringify(description) +
      " Code submitted: " +
      JSON.stringify(code);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeminiOutput(data.output);
        setIsDialogOpen(true); // Open the dialog after generating text
        console.log(data.output);
      } else {
        setGeminiOutput(data.error);
        setIsDialogOpen(true); // Show error in dialog as well
      }
    } catch (error) {
      console.log("Post request error: %s", error);
      setGeminiOutput("An error occurred while generating the text.");
      setIsDialogOpen(true); // Show error in dialog
    }
  };

  const handleAlgoSubmissionInsert = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/submit-algorithm-pass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problemName,
          passed: problemPassed,
          geminiOutput: geminiOutput,
          code_submission: code,
          coding_score: 7,
          problem_solving_score: 8,
          understanding_score: 9,
          strengths: "Good understanding of the problem",
          needs_work: "Optimize the code",
        }),
      });

      if (!response.ok) {
        console.error("Error inserting algo submission");
        return;
      }
      navigateToFlowDiagram();
    } catch (error) {
      console.error("Error inserting algo submission: ", error);
    }
  };

  // Handler to navigate to /FlowDiagram route
  const navigateToFlowDiagram = () => {
    router.push("/FlowDiagram");
  };

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
          handleRunCode={handleRunCode} // Pass the handleRunCode function as a prop
          passedCases={passedCases}
          handleTestCases={handleTestCases}
          isCodeRunning={isCodeRunning}
          setIsCodeRunning={setIsCodeRunning}
          generateText={generateText}
        />

        {/* Dialog to display AI response */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-800 text-white rounded-lg shadow-xl border border-gray-700 max-w-lg w-full p-6">
            <DialogHeader className="border-b border-gray-700 pb-4 mb-4">
              <DialogTitle className="text-2xl font-bold text-indigo-400">
                AI Generated Response
              </DialogTitle>
              <DialogDescription className="text-base text-gray-400">
                <ReactMarkdown
                  children={geminiOutput}
                  remarkPlugins={[remarkGfm]} // Enables GitHub-flavored Markdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="text-gray-200" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-white" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-indigo-300" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="list-disc list-inside" {...props} />
                    ),
                  }}
                />
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button
                className="mt-6 w-full bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={handleAlgoSubmissionInsert}
              >
                Return to Flow Diagram
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
