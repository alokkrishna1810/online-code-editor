"use client";

import { useMemo, useState, useCallback } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { EditorSidebar } from "./editor-sidebar";
import { EditorTabs } from "./editor-tabs";
import { EditorToolbar } from "./editor-toolbar";
import { PreviewPane } from "./preview-pane";
import { CodeEditor } from "./code-editor";
import { useFileSystem } from "@/hooks/use-file-system";
import { cn } from "@/lib/utils";
import { ExecutionPanel } from "./execution-panel";
import { OutputConsole, useConsole } from "./output-console";
import { useCodeExecution } from "@/hooks/use-code-execution";
import { useAuth } from "@clerk/nextjs";

export function EditorLayout() {
  const fileSystem = useFileSystem();
  const console = useConsole();
  const { executeCode, isExecuting } = useCodeExecution();
  const { isSignedIn } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState("dracula");

  const handleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const activeFileObject = fileSystem.getFile(fileSystem.activeFile);

  const isWebApp = useMemo(() => {
    if (!fileSystem.files) {
      return false;
    }
    return fileSystem.files.some((file) => file.name === "index.html");
  }, [fileSystem.files]);

  const handleExecute = useCallback(
    async (code: string, input?: string) => {
      if (!activeFileObject || !activeFileObject.language) {
        console.error("No active file or language to execute.");
        return Promise.resolve({
          output: "Execution error: No active file.",
          error: "Please select a file to execute.",
          exitCode: 1,
          executionTime: 0,
        });
      }
      return executeCode(activeFileObject.language, code, input);
    },
    [activeFileObject, executeCode, console]
  );

  // ✅ Corrected: Coerce isSignedIn to a boolean to handle the undefined loading state.
  const canExecuteCode = !isWebApp && !!isSignedIn;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            collapsible={true}
            collapsedSize={0}
            onCollapse={() => setSidebarCollapsed(true)}
            onExpand={() => setSidebarCollapsed(false)}
            className={cn(
              sidebarCollapsed && "transition-all duration-300 ease-in-out"
            )}
          >
            <EditorSidebar
              fileSystem={fileSystem}
              onCollapse={handleCollapse}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col">
              <EditorToolbar
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={handleCollapse}
                currentLanguage={activeFileObject?.language || "plaintext"}
                onLanguageChange={() => {}}
                onCreateFromTemplate={fileSystem.createFileFromTemplate}
                onRunCode={() => {
                  if (activeFileObject) {
                    handleExecute(activeFileObject.content || "");
                  }
                }}
                onStopExecution={() => {}}
                isExecuting={isExecuting}
                canExecute={canExecuteCode}
                theme={theme}
                onThemeChange={setTheme}
              />
              <EditorTabs fileSystem={fileSystem} />
              <div className="flex-1">
                <CodeEditor fileSystem={fileSystem} theme={theme} />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={25}>
            {isWebApp ? (
              <PreviewPane fileSystem={fileSystem} />
            ) : (
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60} minSize={30}>
                  <ExecutionPanel
                    language={activeFileObject?.language || ""}
                    code={activeFileObject?.content || ""}
                    onExecute={handleExecute}
                    isExecuting={isExecuting}
                    onExecutionStateChange={() => {}}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={40} minSize={20}>
                  <OutputConsole
                    messages={console.messages}
                    onCommand={() => {}}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
