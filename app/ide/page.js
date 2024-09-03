"use client";
import CodeMirrorPythonEditor from "@/components/CodeMirrorPythonEditor";

export default function Page() {
  const initialCode = `def hello_world():\n    print("Hello, CodeMirror with Python!")`;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Python CodeMirror Editor</h1>
      <CodeMirrorPythonEditor initialCode={initialCode} />
    </div>
  );
}
