"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Play,
  Square,
  Terminal,
  FileInput,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ExecutionResult {
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
}

interface ExecutionPanelProps {
  language: string;
  code: string;
  onExecute: (code: string, input?: string) => Promise<ExecutionResult>;
  isExecuting: boolean;
  onExecutionStateChange: (isExecuting: boolean) => void;
}

export function ExecutionPanel({
  language,
  code,
  onExecute,
  isExecuting,
  onExecutionStateChange,
}: ExecutionPanelProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [executionHistory, setExecutionHistory] = useState<
    Array<ExecutionResult & { timestamp: Date }>
  >([]);

  const handleExecute = async () => {
    if (isExecuting) return;

    onExecutionStateChange(true);
    setResult(null);

    try {
      const executionResult = await onExecute(code, input);
      setResult(executionResult);

      // Add to history
      setExecutionHistory((prev) => [
        { ...executionResult, timestamp: new Date() },
        ...prev.slice(0, 9), // Keep last 10 executions
      ]);
    } catch (error) {
      setResult({
        output: "",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        exitCode: 1,
        executionTime: 0,
      });
    } finally {
      onExecutionStateChange(false);
    }
  };

  const getStatusIcon = (exitCode: number) => {
    if (exitCode === 0)
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (exitCode: number) => {
    if (exitCode === 0) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Success
        </Badge>
      );
    }
    return <Badge variant="destructive">Error</Badge>;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />

            <span className="font-medium">Execution Panel</span>

            <Badge variant="outline" className="text-xs">
              {language}
            </Badge>
          </div>

          <Button
            onClick={handleExecute}
            disabled={isExecuting || !code.trim()}
            size="sm"
            className={
              isExecuting
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }
          >
            {isExecuting ? (
              <>
                <Square className="h-4 w-4 mr-1" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-3">
        <Tabs defaultValue="input" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="input">Input</TabsTrigger>

            <TabsTrigger value="output">Output</TabsTrigger>

            <TabsTrigger value="errors">Errors</TabsTrigger>

            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="mt-4 h-[calc(100%-3rem)]">
            <div className="space-y-3 h-full">
              <div className="flex items-center gap-2">
                <FileInput className="h-4 w-4" />

                <span className="text-sm font-medium">Program Input</span>
              </div>

              <Textarea
                placeholder="Enter input for your program (optional)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-[calc(100%-2rem)] resize-none font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="output" className="mt-4 h-[calc(100%-3rem)]">
            <div className="space-y-3 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />

                  <span className="text-sm font-medium">Program Output</span>
                </div>
                {result && (
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.exitCode)}
                    {getStatusBadge(result.exitCode)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {result.executionTime}ms
                    </div>
                  </div>
                )}
              </div>

              <ScrollArea className="h-[calc(100%-2rem)] border rounded-md">
                <div className="p-3">
                  {isExecuting ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>

                      <span>Executing code...</span>
                    </div>
                  ) : result ? (
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {result.output || "No output"}
                    </pre>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      Click "Run Code" to see output here
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="errors" className="mt-4 h-[calc(100%-3rem)]">
            <div className="space-y-3 h-full">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />

                <span className="text-sm font-medium">Errors & Warnings</span>
              </div>

              <ScrollArea className="h-[calc(100%-2rem)] border rounded-md">
                <div className="p-3">
                  {result?.error ? (
                    <pre className="text-sm font-mono text-red-600 whitespace-pre-wrap">
                      {result.error}
                    </pre>
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No errors to display
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4 h-[calc(100%-3rem)]">
            <div className="space-y-3 h-full">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />

                <span className="text-sm font-medium">Execution History</span>
              </div>

              <ScrollArea className="h-[calc(100%-2rem)]">
                <div className="space-y-2">
                  {executionHistory.length > 0 ? (
                    executionHistory.map((execution, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(execution.exitCode)}
                            <span className="text-xs text-muted-foreground">
                              {execution.timestamp.toLocaleTimeString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {getStatusBadge(execution.exitCode)}
                            <span className="text-xs text-muted-foreground">
                              {execution.executionTime}ms
                            </span>
                          </div>
                        </div>
                        {execution.output && (
                          <pre className="text-xs font-mono bg-muted p-2 rounded text-muted-foreground truncate">
                            {execution.output.slice(0, 100)}
                            {execution.output.length > 100 && "..."}
                          </pre>
                        )}
                        {execution.error && (
                          <pre className="text-xs font-mono bg-red-50 text-red-600 p-2 rounded mt-1 truncate">
                            {execution.error.slice(0, 100)}
                            {execution.error.length > 100 && "..."}
                          </pre>
                        )}
                      </Card>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-sm text-center py-8">
                      No execution history yet
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
