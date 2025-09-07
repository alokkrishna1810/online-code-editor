"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { useFileSystem } from "@/hooks/use-file-system";

interface LivePreviewProps {
  fileSystem: ReturnType<typeof useFileSystem>;
  previewMode: "desktop" | "tablet" | "mobile";
}

interface ConsoleMessage {
  type: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: number;
}

export function LivePreview({ fileSystem, previewMode }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { files, getFileContent } = fileSystem;

  const addConsoleMessage = useCallback(
    (type: ConsoleMessage["type"], message: string) => {
      setConsoleMessages((prev) => [
        ...prev.slice(-49), // Keep only last 50 messages
        {
          type,
          message,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  const generatePreviewHTML = useCallback(() => {
    const htmlContent = getFileContent("index.html") || "";
    const cssContent = getFileContent("style.css") || "";
    const jsContent = getFileContent("script.js") || "";

    // Extract additional CSS and JS files
    const additionalCSS = files
      .filter(
        (file) =>
          file.type === "file" &&
          file.path.endsWith(".css") &&
          file.path !== "style.css"
      )
      .map((file) => getFileContent(file.path))
      .join("\n");

    const additionalJS = files
      .filter(
        (file) =>
          file.type === "file" &&
          file.path.endsWith(".js") &&
          file.path !== "script.js"
      )
      .map((file) => getFileContent(file.path))
      .join("\n");

    const combinedCSS = cssContent + "\n" + additionalCSS;
    const combinedJS = jsContent + "\n" + additionalJS;

    // Create the preview HTML with injected CSS and JS
    let previewHTML = htmlContent;

    // If no HTML content, create a basic structure
    if (!htmlContent.trim()) {
      previewHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
</head>
<body>
    <div style="padding: 2rem; text-align: center; color: #666;">
        <h2>No HTML content</h2>
        <p>Add some HTML to see the preview</p>
    </div>
</body>
</html>`;
    }

    // Inject CSS
    if (combinedCSS.trim()) {
      const cssTag = `<style>${combinedCSS}</style>`;
      if (previewHTML.includes("</head>")) {
        previewHTML = previewHTML.replace("</head>", `${cssTag}\n</head>`);
      } else {
        previewHTML = `<head>${cssTag}</head>${previewHTML}`;
      }
    }

    // Inject console capture and JS
    if (combinedJS.trim()) {
      const consoleScript = `
<script>
(function() {
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
  };
  
  function postMessage(type, args) {
    try {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      window.parent.postMessage({
        type: 'console',
        level: type,
        message: message
      }, '*');
    } catch (e) {
      // Ignore errors in console capture
    }
  }
  
  console.log = function(...args) {
    originalConsole.log.apply(console, args);
    postMessage('log', args);
  };
  
  console.error = function(...args) {
    originalConsole.error.apply(console, args);
    postMessage('error', args);
  };
  
  console.warn = function(...args) {
    originalConsole.warn.apply(console, args);
    postMessage('warn', args);
  };
  
  console.info = function(...args) {
    originalConsole.info.apply(console, args);
    postMessage('info', args);
  };
  
  window.addEventListener('error', function(e) {
    postMessage('error', [e.message + ' at ' + e.filename + ':' + e.lineno]);
  });
  
  window.addEventListener('unhandledrejection', function(e) {
    postMessage('error', ['Unhandled promise rejection:', e.reason]);
  });
})();
</script>
<script>
try {
${combinedJS}
} catch (error) {
  console.error('JavaScript Error:', error.message);
}
</script>`;

      if (previewHTML.includes("</body>")) {
        previewHTML = previewHTML.replace(
          "</body>",
          `${consoleScript}\n</body>`
        );
      } else {
        previewHTML = `${previewHTML}${consoleScript}`;
      }
    }

    return previewHTML;
  }, [files, getFileContent]);

  const updatePreview = useCallback(() => {
    if (!iframeRef.current) return;

    setIsLoading(true);
    const previewHTML = generatePreviewHTML();

    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;

      if (doc) {
        doc.open();
        doc.write(previewHTML);
        doc.close();
      }
    } catch (error) {
      addConsoleMessage("error", `Preview Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [generatePreviewHTML, addConsoleMessage]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "console") {
        addConsoleMessage(event.data.level, event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [addConsoleMessage]);

  // Update preview when files change
  useEffect(() => {
    const timeoutId = setTimeout(updatePreview, 300); // Debounce updates
    return () => clearTimeout(timeoutId);
  }, [updatePreview, files]);

  // Initial preview load
  useEffect(() => {
    updatePreview();
  }, []);

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case "mobile":
        return { width: "375px", height: "667px" };
      case "tablet":
        return { width: "768px", height: "1024px" };
      default:
        return { width: "100%", height: "100%" };
    }
  };

  const dimensions = getPreviewDimensions();

  return (
    <div className="h-full flex flex-col">
      {/* Preview Area */}
      <div className="flex-1 p-4 bg-background/50 overflow-auto">
        <div
          className="mx-auto bg-white rounded-lg border shadow-sm relative"
          style={{
            width: dimensions.width,
            height: previewMode === "desktop" ? "100%" : dimensions.height,
            minHeight: previewMode === "desktop" ? "400px" : dimensions.height,
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>

                <p className="text-sm text-muted-foreground">
                  Updating preview...
                </p>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            className="w-full h-full rounded-lg"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            title="Live Preview"
          />
        </div>
      </div>

      {/* Console Output */}
      {consoleMessages.length > 0 && (
        <div className="border-t bg-card/30 backdrop-blur">
          <div className="p-2 border-b bg-card/50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Console</h4>

              <button
                onClick={() => setConsoleMessages([])}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-32 overflow-y-auto p-2 space-y-1 font-mono text-xs">
            {consoleMessages.slice(-10).map((msg, index) => (
              <div
                key={`${msg.timestamp}-${index}`}
                className={`flex items-start space-x-2 ${
                  msg.type === "error"
                    ? "text-destructive"
                    : msg.type === "warn"
                    ? "text-yellow-600"
                    : msg.type === "info"
                    ? "text-blue-600"
                    : "text-foreground"
                }`}
              >
                <span className="text-muted-foreground text-xs">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>

                <span className="flex-1 break-all">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
