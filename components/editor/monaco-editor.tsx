"use client";

import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";

interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  theme?: "vs-dark" | "vs-light";
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export function MonacoEditor({
  value,
  language,
  onChange,
  theme = "vs-dark",
  options = {},
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLanguageConfig = (lang: string) => {
    const baseConfig = {
      fontSize: 14,
      fontFamily:
        "var(--font-mono), 'Fira Code', 'Cascadia Code', Consolas, monospace",
      lineHeight: 1.6,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      insertSpaces: true,
      wordWrap: "on" as const,
      lineNumbers: "on" as const,
      renderWhitespace: "selection" as const,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
      suggest: {
        showKeywords: true,
        showSnippets: true,
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      parameterHints: {
        enabled: true,
      },
    };

    switch (lang) {
      case "python":
        return {
          ...baseConfig,
          tabSize: 4,
          detectIndentation: false,
          insertSpaces: true,
          rulers: [79, 88], // PEP 8 line length guidelines
        };
      case "java":
        return {
          ...baseConfig,
          tabSize: 4,
          detectIndentation: false,
          insertSpaces: true,
          rulers: [100, 120],
        };
      case "cpp":
      case "c":
        return {
          ...baseConfig,
          tabSize: 2,
          detectIndentation: false,
          insertSpaces: true,
          rulers: [80, 100],
        };
      case "javascript":
      case "typescript":
        return {
          ...baseConfig,
          tabSize: 2,
          detectIndentation: false,
          insertSpaces: true,
          rulers: [80, 100],
        };
      default:
        return {
          ...baseConfig,
          tabSize: 2,
        };
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "6366f1", fontStyle: "bold" },
        { token: "string", foreground: "10b981" },
        { token: "number", foreground: "f59e0b" },
        { token: "type", foreground: "8b5cf6" },
        { token: "function", foreground: "06b6d4" },
        { token: "keyword.control", foreground: "ec4899" },
        { token: "storage.type", foreground: "8b5cf6" },
        { token: "entity.name.function", foreground: "06b6d4" },
        { token: "variable.parameter", foreground: "f59e0b" },
        { token: "constant", foreground: "f59e0b" },
        { token: "entity.name.class", foreground: "10b981" },
        // Enhanced C++ specific tokens
        { token: "keyword.cpp", foreground: "6366f1", fontStyle: "bold" },
        { token: "type.cpp", foreground: "8b5cf6" },
        { token: "preprocessor.cpp", foreground: "ec4899" },
        { token: "namespace.cpp", foreground: "10b981" },
        // Enhanced Python specific tokens
        { token: "keyword.python", foreground: "6366f1", fontStyle: "bold" },
        { token: "decorator.python", foreground: "f59e0b" },
        { token: "self.python", foreground: "ec4899", fontStyle: "italic" },
        // Enhanced Java specific tokens
        { token: "annotation.java", foreground: "f59e0b" },
        { token: "modifier.java", foreground: "6366f1" },
        { token: "package.java", foreground: "10b981" },
      ],
      colors: {
        "editor.background": "#0f172a",
        "editor.foreground": "#f1f5f9",
        "editor.lineHighlightBackground": "#1e293b",
        "editor.selectionBackground": "#374151",
        "editorCursor.foreground": "#6366f1",
        "editorLineNumber.foreground": "#64748b",
        "editorLineNumber.activeForeground": "#f1f5f9",
        "editorBracketMatch.background": "#374151",
        "editorBracketMatch.border": "#6366f1",
      },
    });

    monaco.editor.defineTheme("custom-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "6366f1", fontStyle: "bold" },
        { token: "string", foreground: "059669" },
        { token: "number", foreground: "d97706" },
        { token: "type", foreground: "7c3aed" },
        { token: "function", foreground: "0891b2" },
        { token: "keyword.control", foreground: "be185d" },
        { token: "storage.type", foreground: "7c3aed" },
        { token: "entity.name.function", foreground: "0891b2" },
        { token: "variable.parameter", foreground: "d97706" },
        { token: "constant", foreground: "d97706" },
        { token: "entity.name.class", foreground: "059669" },
        // Enhanced C++ specific tokens
        { token: "keyword.cpp", foreground: "6366f1", fontStyle: "bold" },
        { token: "type.cpp", foreground: "7c3aed" },
        { token: "preprocessor.cpp", foreground: "be185d" },
        { token: "namespace.cpp", foreground: "059669" },
        // Enhanced Python specific tokens
        { token: "keyword.python", foreground: "6366f1", fontStyle: "bold" },
        { token: "decorator.python", foreground: "d97706" },
        { token: "self.python", foreground: "be185d", fontStyle: "italic" },
        // Enhanced Java specific tokens
        { token: "annotation.java", foreground: "d97706" },
        { token: "modifier.java", foreground: "6366f1" },
        { token: "package.java", foreground: "059669" },
      ],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#1f2937",
        "editor.lineHighlightBackground": "#f8fafc",
        "editor.selectionBackground": "#e5e7eb",
        "editorCursor.foreground": "#6366f1",
        "editorLineNumber.foreground": "#9ca3af",
        "editorLineNumber.activeForeground": "#374151",
        "editorBracketMatch.background": "#e5e7eb",
        "editorBracketMatch.border": "#6366f1",
      },
    });

    const editor = monaco.editor.create(editorRef.current, {
      value,
      language,
      theme: theme === "vs-dark" ? "custom-dark" : "custom-light",
      ...getLanguageConfig(language),
      ...options,
    });

    monacoRef.current = editor;
    setIsLoading(false);

    // Handle content changes
    const disposable = editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });

    return () => {
      disposable.dispose();
      editor.dispose();
    };
  }, []);

  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      monacoRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (monacoRef.current) {
      monaco.editor.setModelLanguage(monacoRef.current.getModel()!, language);

      const config = getLanguageConfig(language);
      monacoRef.current.updateOptions({
        tabSize: config.tabSize,
        insertSpaces: config.insertSpaces,
      });
    }
  }, [language]);

  useEffect(() => {
    if (monacoRef.current) {
      monaco.editor.setTheme(
        theme === "vs-dark" ? "custom-dark" : "custom-light"
      );
    }
  }, [theme]);

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      )}
      <div ref={editorRef} className="h-full w-full" />
    </div>
  );
}
