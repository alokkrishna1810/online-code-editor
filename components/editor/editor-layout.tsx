"use client";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Code2, Play, Save, Settings, Users } from "lucide-react";
import { EditorSidebar } from "./editor-sidebar";
import { EditorTabs } from "./editor-tabs";
import { EditorToolbar } from "./editor-toolbar";
import { PreviewPane } from "./preview-pane";
import { CodeEditor } from "./code-editor";
import { OutputConsole, useConsole } from "./output-console";
import { ExecutionPanel } from "./execution-panel";
import { useFileSystem } from "@/hooks/use-file-system";
import { useCodeExecution } from "@/hooks/use-code-execution";
import { useState, useCallback } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function EditorLayout() {
  const fileSystem = useFileSystem();
  const { activeFile, openFile, getFileContent, createFileFromTemplate } =
    fileSystem;
  const { executeCode, isExecuting } = useCodeExecution();
  const console = useConsole();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [showExecutionPanel, setShowExecutionPanel] = useState(false);

  const handleLanguageChange = useCallback(
    (language: string, extension: string) => {
      setCurrentLanguage(language);
      // Optionally create a new file with the selected language
      if (!activeFile) {
        createFileFromTemplate("", `new-file.${extension}`, "");
      }
    },
    [activeFile, createFileFromTemplate]
  );

  const handleCreateFromTemplate = useCallback(
    (name: string, content: string) => {
      createFileFromTemplate("", name, content);
      console.success(`Created file: ${name}`);
    },
    [createFileFromTemplate, console]
  );

  const handleRunCode = useCallback(async () => {
    if (!activeFile) {
      console.error("No file selected");
      return;
    }

    const code = getFileContent(activeFile);
    if (!code.trim()) {
      console.warn("No code to execute");
      return;
    }

    setShowExecutionPanel(true);
    console.info(`Executing ${currentLanguage} code...`);

    try {
      const startTime = Date.now();
      const result = await executeCode(currentLanguage, code);
      const duration = Date.now() - startTime;

      if (result.exitCode === 0) {
        console.success(`Execution completed in ${duration}ms`);
        if (result.output) {
          console.addMessage("output", result.output, "execution");
        }
      } else {
        console.error(`Execution failed with exit code ${result.exitCode}`);
        if (result.error) {
          console.addMessage("error", result.error, "execution");
        }
      }
    } catch (error) {
      console.error(
        `Execution error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [activeFile, getFileContent, currentLanguage, executeCode, console]);

  const handleStopExecution = useCallback(() => {
    console.warn("Execution stopped by user");
  }, [console]);

  const canExecute = Boolean(
    activeFile &&
      ["python", "java", "cpp", "c", "javascript"].includes(currentLanguage)
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Sidebar */}
          {!sidebarCollapsed && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <EditorSidebar
                  activeFile={activeFile}
                  onFileSelect={openFile}
                  onCollapse={() => setSidebarCollapsed(true)}
                  fileSystem={fileSystem}
                />
              </ResizablePanel>
              <ResizableHandle />
            </>
          )}

          {/* Editor Area */}
          <ResizablePanel defaultSize={sidebarCollapsed ? 50 : 40} minSize={30}>
            <div className="h-full flex flex-col">
              <EditorToolbar
                sidebarCollapsed={sidebarCollapsed}
                onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
                onCreateFromTemplate={handleCreateFromTemplate}
                onRunCode={handleRunCode}
                onStopExecution={handleStopExecution}
                isExecuting={isExecuting}
                canExecute={canExecute}
              />
              <EditorTabs fileSystem={fileSystem} />
              <div className="flex-1">
                <CodeEditor fileSystem={fileSystem} />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Preview/Execution/Console */}
          <ResizablePanel defaultSize={sidebarCollapsed ? 50 : 40} minSize={25}>
            <ResizablePanelGroup direction="vertical">
              {/* Preview/Execution Panel */}
              <ResizablePanel
                defaultSize={showExecutionPanel ? 60 : 70}
                minSize={30}
              >
                {showExecutionPanel && canExecute ? (
                  <ExecutionPanel
                    language={currentLanguage}
                    code={activeFile ? getFileContent(activeFile) : ""}
                    onExecute={(code, input) =>
                      executeCode(currentLanguage, code, input)
                    }
                    isExecuting={isExecuting}
                    onExecutionStateChange={setShowExecutionPanel}
                  />
                ) : (
                  <PreviewPane fileSystem={fileSystem} />
                )}
              </ResizablePanel>

              <ResizableHandle />

              {/* Console Panel */}
              <ResizablePanel
                defaultSize={showExecutionPanel ? 40 : 30}
                minSize={20}
              >
                <OutputConsole
                  messages={console.messages}
                  onCommand={(cmd) => {
                    console.addMessage("command", `> ${cmd}`);
                    console.info(`Command executed: ${cmd}`);
                  }}
                  showTimestamps={true}
                  maxMessages={1000}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
