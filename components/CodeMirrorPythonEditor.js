// components/CodeMirrorPythonEditor.js
"use client";
import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import "@/styles/CodeMirrorPythonEditor.css";

export default function CodeMirrorPythonEditor({ initialCode }) {
  const editorRef = useRef();

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: initialCode,
      extensions: [basicSetup, python(), oneDark],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [initialCode]);

  return (
    <div
      ref={editorRef}
      style={{
        border: "1px solid #ddd",
        borderRadius: "4px",
        height: "400px",
        width: "100%",
        overflow: "auto",
        backgroundColor: "#282c34", // Set to match One Dark theme background
        color: "#abb2bf", // Optional: Set text color to match theme
      }}
    />
  );
}
