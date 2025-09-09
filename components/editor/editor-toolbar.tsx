"use client"

import { Button } from "@/components/ui/button"
import { PanelLeftOpen, Undo, Redo, Search, Replace, Command, Maximize2, Play, Square, Settings, Plus } from "lucide-react"
import { LanguageSelector } from "./language-selector"
import { TemplateSelector } from "./template-selector"
import { SignedIn, SignedOut } from "@clerk/nextjs"

interface EditorToolbarProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  currentLanguage: string
  onLanguageChange: (language: string, extension: string) => void
  onCreateFromTemplate: (name: string, content: string) => void
  onRunCode: () => void
  onStopExecution: () => void
  isExecuting: boolean
  canExecute: boolean
}

export function EditorToolbar({
  sidebarCollapsed,
  onToggleSidebar,
  currentLanguage,
  onLanguageChange,
  onCreateFromTemplate,
  onRunCode,
  onStopExecution,
  isExecuting,
  canExecute,
}: EditorToolbarProps) {
  return (
    <div className="border-b bg-card/20 backdrop-blur px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {sidebarCollapsed && (
            <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          )}

          <SignedIn>
            <TemplateSelector onCreateFile={onCreateFromTemplate} />
          </SignedIn>

          <SignedOut>
            <Button variant="outline" size="sm" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Templates (Sign in required)
            </Button>
          </SignedOut>

          <div className="w-px h-4 bg-border mx-2" />

          <Button variant="ghost" size="sm">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Redo className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-2" />
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Replace className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />

          <div className="w-px h-4 bg-border mx-2" />

          {canExecute && (
            <>
              {!isExecuting ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onRunCode}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
              ) : (
                <Button variant="destructive" size="sm" onClick={onStopExecution}>
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              )}
            </>
          )}

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Command className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
