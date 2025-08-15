"use client";

import { useState, useCallback } from "react";

interface ExecutionResult {
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
}

export function useCodeExecution() {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = useCallback(
    async (
      language: string,
      code: string,
      input?: string
    ): Promise<ExecutionResult> => {
      setIsExecuting(true);

      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch("/api/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            language,
            code,
            input,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Execution failed");
        }

        return data.result;
      } catch (error) {
        throw error;
      } finally {
        setIsExecuting(false);
      }
    },
    []
  );

  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/execute/health");
      const data = await response.json();
      return data.healthy;
    } catch (error) {
      return false;
    }
  }, []);

  const getAvailableLanguages = useCallback(async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/execute/languages");
      const data = await response.json();
      return data.languages;
    } catch (error) {
      return [];
    }
  }, []);

  return {
    executeCode,
    checkHealth,
    getAvailableLanguages,
    isExecuting,
  };
}
