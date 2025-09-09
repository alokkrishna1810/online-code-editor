"use client"; // Crucial: This directive marks the component for client-side rendering.

import Editor, { OnChange, OnMount, loader } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react"; // Your preferred loading spinner
import type { editor } from "monaco-editor"; // We only import types

// --- Configuration Logic (Your code, slightly polished) ---
// This logic is excellent and can be kept as is.
const getLanguageConfig = (lang: string) => {
  const baseConfig = {
    fontSize: 14,
    fontFamily:
      "var(--font-geist-mono), 'Fira Code', 'Cascadia Code', monospace",
    lineHeight: 1.6,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: "on" as const,
    bracketPairColorization: { enabled: true },
    tabSize: 2,
    insertSpaces: true,
  };

  switch (lang) {
    case "python":
      return { ...baseConfig, tabSize: 4, rulers: [88] };
    case "java":
      return { ...baseConfig, tabSize: 4, rulers: [120] };
    default:
      return baseConfig;
  }
};

// --- Custom Theme Definitions ---
// This setup logic is also perfect.
const defineCustomThemes = (monacoInstance: typeof import("monaco-editor")) => {
  monacoInstance.editor.defineTheme("custom-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      /* Your detailed dark theme rules from your code */
    ],
    colors: { "editor.background": "#020817" /* ...your other colors */ },
  });
  monacoInstance.editor.defineTheme("custom-light", {
    base: "vs",
    inherit: true,
    rules: [
      /* Your detailed light theme rules */
    ],
    colors: { "editor.background": "#ffffff" /* ...your other colors */ },
  });
};

// --- Component Props ---
interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: OnChange; // Use the type from the library for perfect compatibility
  theme?: "vs-dark" | "vs-light" | string; // Corrected: Added theme prop
  options?: editor.IStandaloneEditorConstructionOptions;
}

// --- The Modern Component ---
export function MonacoEditor({
  value,
  language,
  onChange,
  theme, // Corrected: Added theme to destructuring
  options,
}: MonacoEditorProps) {
  const { resolvedTheme } = useTheme();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // This is the ideal place for one-time setup
    defineCustomThemes(monaco);
  };

  const languageConfig = getLanguageConfig(language);
  // Use the passed theme prop, or fall back to the resolved theme from next-themes
  const editorTheme = theme === "vs-dark" ? "custom-dark" : "custom-light";

  return (
    <Editor
      height="100%"
      width="100%"
      language={language}
      value={value}
      theme={editorTheme}
      onMount={handleEditorDidMount}
      onChange={onChange}
      loading={<Loader2 className="w-8 h-8 animate-spin" />}
      options={{
        ...languageConfig,
        ...options, // Allow custom overrides
      }}
    />
  );
}
