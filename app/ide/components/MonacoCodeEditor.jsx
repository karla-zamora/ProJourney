import Editor, { loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import Split from "react-split";
import EditorFooter from "./EditorFooter";

const pandaTheme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "", foreground: "e6e6e6", background: "292a2b" },
    { token: "comment", foreground: "676b79", fontStyle: "italic" },
    { token: "keyword", foreground: "ff75b5" },
    { token: "identifier", foreground: "19f9d8" },
    { token: "string", foreground: "19f9d8" },
    { token: "number", foreground: "ffb86c" },
    { token: "type", foreground: "ff2c6d" },
    { token: "function", foreground: "e6e6e6" },
    { token: "operator", foreground: "ff75b5" },
    { token: "delimiter", foreground: "e6e6e6" },
    { token: "variable", foreground: "ffcc95" },
  ],
  colors: {
    "editor.background": "#292a2b",
    "editor.foreground": "#e6e6e6",
    "editorCursor.foreground": "#ffcc95",
    "editorLineNumber.foreground": "#676b79",
    "editorLineNumber.activeForeground": "#ff75b5",
    "editorIndentGuide.background": "#3b3c3d",
    "editor.selectionBackground": "#3b3c3d",
    "editor.selectionHighlightBackground": "#ffcc95",
  },
};

// Your defined Atom Material Theme
const atomMaterialTheme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "", foreground: "d0d0d0", background: "263238" },
    { token: "comment", foreground: "546e7a", fontStyle: "italic" },
    { token: "keyword", foreground: "c792ea" },
    { token: "identifier", foreground: "82aaff" },
    { token: "string", foreground: "c3e88d" },
    { token: "number", foreground: "f78c6c" },
    { token: "type", foreground: "ffcb6b" },
    { token: "function", foreground: "82aaff" },
    { token: "operator", foreground: "89ddff" },
    { token: "delimiter", foreground: "d0d0d0" },
    { token: "variable", foreground: "f07178" },
  ],
  colors: {
    "editor.background": "#282828",
    "editor.foreground": "#d0d0d0",
    "editorCursor.foreground": "#ffcb6b",
    "editorLineNumber.foreground": "#37474f",
    "editorLineNumber.activeForeground": "#d0d0d0",
    "editorIndentGuide.background": "#37474f",
    "editor.selectionBackground": "#455a64",
    "editor.selectionHighlightBackground": "#546e7a",
  },
};

export default function MonacoEditorComponent({
  code,
  setCode,
  theme,
  onChange,
  testCases,
  handleRunCode,
}) {
  const [language, setLanguage] = useState('python');
  const [selectedTestCase, setSelectedTestCase] = useState(0); // Default to first test case

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme("atom-material", atomMaterialTheme);
    });
  }, []);

  const handleTestCaseClick = (index) => {
    setSelectedTestCase(index); // Set selected test case
  };

  return (
    <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden overflow-y-hidden'>
      <Dropdown setLanguage={setLanguage} />
      <Split className="h-[calc(100vh-100px)]" direction="vertical" sizes={[60, 40]} minSize={60}>
        <div className="w-full overflow-auto">
          <Editor
            height="90vh"
            defaultLanguage={language}
            value={code}
            theme="atom-material"
            onChange={(e) => setCode(e)}
            options={{
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>
        <div className="w-full px-5 overflow-auto">
          <div className="flex flex-col">
            <div className="flex h-10 items-center space-x-6">
              <div className="relative flex h-full flex-col justify-center cursor-pointer">
                <div className="text-sm font-medium leading-5 text-white">Testcases</div>
                <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
              </div>
            </div>

            {/* Render test case buttons like a navbar */}
            <div className="flex gap-4 mt-2 mb-4 overflow-x-auto">
              {testCases.map((_, index) => (
                <button
                  key={index}
                  className={`font-medium transition-all focus:outline-none inline-flex hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${
                    selectedTestCase === index ? 'bg-dark-fill-1 text-white' : 'bg-dark-fill-2 text-gray-300'
                  }`}
                  onClick={() => handleTestCaseClick(index)}
                  style={{
                    backgroundColor: selectedTestCase === index ? '#4a4b4d' : '#5a5b5c', // Both shades lighter
                    color: selectedTestCase === index ? '#f0f0f0' : '#dcdcdc',
                  }}
                >
                  Case {index + 1}
                </button>
              ))}
            </div>

            {/* Display selected test case details */}
            {testCases[selectedTestCase] && (
              <div className="font-semibold mt-4">
                <p className="text-sm font-medium mt-4 text-white">Input:</p>
                <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
                  {JSON.stringify(testCases[selectedTestCase].input, null, 2)}
                </div>
                <p className="text-sm font-medium mt-4 text-white">Expected Output:</p>
                <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
                  {JSON.stringify(testCases[selectedTestCase].expectedOutput)}
                </div>
              </div>
            )}
          </div>
        </div>
      </Split>

      <EditorFooter handleRunCode={handleRunCode} />
    </div>
  );
}
