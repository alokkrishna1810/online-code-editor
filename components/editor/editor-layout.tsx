"use client";

import { useState } from "react";
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

export function EditorLayout() {
  const fileSystem = useFileSystem();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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
                // These props need to be wired up with state if you need them
                currentLanguage="javascript"
                onLanguageChange={() => {}}
                onCreateFromTemplate={() => {}}
                onRunCode={() => {}}
                onStopExecution={() => {}}
                isExecuting={false}
                canExecute={true}
              />
              <EditorTabs fileSystem={fileSystem} />
              <div className="flex-1">
                <CodeEditor fileSystem={fileSystem} />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40} minSize={25}>
            <PreviewPane fileSystem={fileSystem} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
