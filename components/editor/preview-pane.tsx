"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Smartphone,
  Tablet,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { LivePreview } from "./live-preview";
import type { useFileSystem } from "@/hooks/use-file-system";

interface PreviewPaneProps {
  fileSystem: ReturnType<typeof useFileSystem>;
}

export function PreviewPane({ fileSystem }: PreviewPaneProps) {
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const refreshPreview = () => {
    // Force refresh by updating a key or triggering re-render
    window.location.reload();
  };

  const openInNewTab = () => {
    // In a real implementation, this would open the preview in a new tab
    // For now, we'll just show an alert
    alert("Open in new tab functionality would be implemented here");
  };

  return (
    <div className="h-full bg-card/30 backdrop-blur border-l flex flex-col">
      {/* Preview Header */}
      <div className="border-b bg-card/50 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm font-space-grotesk">
            Live Preview
          </h3>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={refreshPreview}
              title="Refresh"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={openInNewTab}
              title="Open in new tab"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Device Toggle */}
        <div className="flex items-center space-x-1">
          <Button
            variant={previewMode === "desktop" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
            title="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </Button>

          <Button
            variant={previewMode === "tablet" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("tablet")}
            title="Tablet view"
          >
            <Tablet className="h-4 w-4" />
          </Button>

          <Button
            variant={previewMode === "mobile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
            title="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Live Preview Content */}
      <div className="flex-1 overflow-hidden">
        <LivePreview fileSystem={fileSystem} previewMode={previewMode} />
      </div>
    </div>
  );
}
