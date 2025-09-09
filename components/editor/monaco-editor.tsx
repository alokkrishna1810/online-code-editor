"use client";

import Editor, { OnChange, OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Loader2 } from "lucide-react";

// This function defines all available themes
const defineCustomThemes = (monacoInstance: typeof import("monaco-editor")) => {
  monacoInstance.editor.defineTheme("custom-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: { "editor.background": "#020817" },
  });
  monacoInstance.editor.defineTheme("custom-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: { "editor.background": "#ffffff" },
  });
  // Dracula Theme
  monacoInstance.editor.defineTheme("dracula", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "type", foreground: "8be9fd", fontStyle: "italic" },
      { token: "function", foreground: "50fa7b" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#44475a",
      "editor.lineHighlightBackground": "#44475a55",
      "editorCursor.foreground": "#f8f8f0",
      "editorWhitespace.foreground": "#3b3a42",
    },
  });
  // Monokai Theme
  monacoInstance.editor.defineTheme("monokai", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "75715e" },
      { token: "string", foreground: "e6db74" },
      { token: "number", foreground: "ae81ff" },
      { token: "keyword", foreground: "f92672" },
      { token: "type", foreground: "66d9ef", fontStyle: "italic" },
      { token: "function", foreground: "a6e22e" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#f8f8f2",
      "editor.selectionBackground": "#49483e",
      "editor.lineHighlightBackground": "#3e3d32",
      "editorCursor.foreground": "#f8f8f0",
    },
  });
  // GitHub Dark Theme
  monacoInstance.editor.defineTheme("github-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8b949e" },
      { token: "string", foreground: "a5d6ff" },
      { token: "number", foreground: "79c0ff" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "type", foreground: "ffa657" },
      { token: "function", foreground: "d2a8ff" },
      { token: "variable", foreground: "ffa657" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#c9d1d9",
      "editor.selectionBackground": "#264f78",
      "editor.lineHighlightBackground": "#161b22",
      "editorCursor.foreground": "#58a6ff",
    },
  });
};

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: OnChange;
  theme?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
}

export function MonacoEditor({
  value,
  language,
  onChange,
  theme = "custom-dark",
  options,
}: MonacoEditorProps) {
  // ✅ The onMount handler should only be used for one-time setup
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    defineCustomThemes(monaco);
  };

  return (
    <Editor
      height="100%"
      width="100%"
      language={language}
      value={value}
      // ✅ The theme prop declaratively handles all theme changes
      theme={theme}
      onMount={handleEditorDidMount}
      onChange={onChange}
      loading={<Loader2 className="w-8 h-8 animate-spin" />}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
        ...options,
      }}
    />
  );
}
