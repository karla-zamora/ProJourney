// app/components/MonacoEditorComponent.js
"use client";

import Editor, { loader } from "@monaco-editor/react";
import { useEffect } from "react";

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

// Atom Material Theme
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
    "editor.background": "#263238",
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
  value,
  language,
  theme,
  onChange,
}) {
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme("atom-material", atomMaterialTheme);
    });
  }, []);

  return (
    <Editor
      height="100%"
      defaultLanguage={language || "python"}
      defaultValue={value}
      theme="atom-material" // Use 'panda' as the theme
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
}
