"use client";

import { useEffect, useState, useCallback } from "react";
import { useFileSystem } from "@/hooks/use-file-system";
import { Loader2, ServerCrash } from "lucide-react";

interface PreviewPaneProps {
  fileSystem: ReturnType<typeof useFileSystem>;
}

export function PreviewPane({ fileSystem }: PreviewPaneProps) {
  const { files, getFilesForPreview } = fileSystem; // Corrected: Use getFilesForPreview
  const [previewHtml, setPreviewHtml] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generatePreviewHTML = useCallback(() => {
    try {
      // ✅ Use the correct function name here
      const allFiles = getFilesForPreview();
      const htmlFile = allFiles["index.html"];
      const cssFile = allFiles["style.css"];
      const jsFile = allFiles["script.js"];

      if (!htmlFile) {
        return `<div style="color: red; font-family: sans-serif;">Error: index.html not found.</div>`;
      }

      // Inject CSS and JS into the HTML for the preview
      return `
        <html>
          <head>
            ${cssFile ? `<style>${cssFile}</style>` : ""}
          </head>
          <body>
            ${htmlFile}
            ${jsFile ? `<script>${jsFile}</script>` : ""}
          </body>
        </html>
      `;
    } catch (e) {
      console.error("Error generating preview:", e);
      setError("Failed to generate preview.");
      return "";
    }
  }, [getFilesForPreview]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const html = generatePreviewHTML();
    setPreviewHtml(html);
    setIsLoading(false);
  }, [files, generatePreviewHTML]);

  return (
    <div className="h-full bg-white relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500">
          <ServerCrash className="h-10 w-10 mb-2" />
          <p className="font-semibold">Preview Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {!isLoading && !error && (
        <iframe
          srcDoc={previewHtml}
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
        />
      )}
    </div>
  );
}
