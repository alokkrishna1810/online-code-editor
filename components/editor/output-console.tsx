"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Terminal,
  Trash2,
  Download,
  Search,
  ChevronRight,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  Copy,
} from "lucide-react";

interface ConsoleMessage {
  id: string;
  type: "log" | "info" | "warn" | "error" | "success" | "command" | "output";
  content: string;
  timestamp: Date;
  source?: string;
}

interface OutputConsoleProps {
  messages?: ConsoleMessage[];
  onCommand?: (command: string) => void;
  showTimestamps?: boolean;
  maxMessages?: number;
}

export function OutputConsole({
  messages: externalMessages = [],
  onCommand,
  showTimestamps = true,
  maxMessages = 1000,
}: OutputConsoleProps) {
  const [internalMessages, setInternalMessages] = useState<ConsoleMessage[]>(
    []
  );
  const [command, setCommand] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine external and internal messages
  const allMessages = [...externalMessages, ...internalMessages];

  // Filter messages based on type and search
  const filteredMessages = allMessages.filter((message) => {
    const matchesFilter = filter === "all" || message.type === filter;
    const matchesSearch =
      !searchQuery ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [filteredMessages]);

  // Add internal message
  const addMessage = useCallback(
    (type: ConsoleMessage["type"], content: string, source?: string) => {
      const newMessage: ConsoleMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        content,
        timestamp: new Date(),
        source,
      };

      setInternalMessages((prev) => {
        const updated = [...prev, newMessage];
        return updated.slice(-maxMessages); // Keep only the last maxMessages
      });
    },
    [maxMessages]
  );

  // Handle command execution
  const handleCommand = useCallback(
    (cmd: string) => {
      if (!cmd.trim()) return;

      // Add command to console
      addMessage("command", `> ${cmd}`);

      // Handle built-in commands
      const trimmedCmd = cmd.trim().toLowerCase();

      if (trimmedCmd === "clear") {
        setInternalMessages([]);
        return;
      }

      if (trimmedCmd === "help") {
        addMessage("info", "Available commands:");
        addMessage("info", "  clear - Clear the console");
        addMessage("info", "  help - Show this help message");
        addMessage("info", "  time - Show current time");
        addMessage("info", "  version - Show version info");
        return;
      }

      if (trimmedCmd === "time") {
        addMessage("info", `Current time: ${new Date().toLocaleString()}`);
        return;
      }

      if (trimmedCmd === "version") {
        addMessage("info", "CodeCollab Console v1.0.0");
        return;
      }

      // Call external command handler
      if (onCommand) {
        onCommand(cmd);
      } else {
        addMessage("error", `Unknown command: ${cmd}`);
      }
    },
    [addMessage, onCommand]
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(command);
      setCommand("");
    } else if (e.key === "ArrowUp") {
      // TODO: Implement command history
      e.preventDefault();
    }
  };

  const clearConsole = () => {
    setInternalMessages([]);
  };

  const exportLogs = () => {
    const logs = filteredMessages
      .map((msg) => {
        const timestamp = showTimestamps
          ? `[${msg.timestamp.toLocaleTimeString()}] `
          : "";
        const type = `[${msg.type.toUpperCase()}] `;
        return `${timestamp}${type}${msg.content}`;
      })
      .join("\n");

    const blob = new Blob([logs], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `console-logs-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    addMessage("success", "Message copied to clipboard");
  };

  const getMessageIcon = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warn":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "command":
        return <ChevronRight className="h-4 w-4 text-purple-500" />;
      default:
        return <Terminal className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMessageColor = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return "text-red-600 dark:text-red-400";
      case "warn":
        return "text-yellow-600 dark:text-yellow-400";
      case "success":
        return "text-green-600 dark:text-green-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      case "command":
        return "text-purple-600 dark:text-purple-400 font-medium";
      default:
        return "text-foreground";
    }
  };

  const messageTypeCounts = allMessages.reduce((acc, msg) => {
    acc[msg.type] = (acc[msg.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full flex flex-col bg-background border-l">
      {/* Header */}
      <div className="border-b p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />

            <span className="font-medium">Console</span>

            <Badge variant="outline" className="text-xs">
              {filteredMessages.length} messages
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className={isSearchVisible ? "bg-accent" : ""}
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={exportLogs}>
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={clearConsole}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        {isSearchVisible && (
          <div className="mb-3">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8"
            />
          </div>
        )}

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-8">
            <TabsTrigger value="all" className="text-xs">
              All {allMessages.length > 0 && `(${allMessages.length})`}
            </TabsTrigger>

            <TabsTrigger value="log" className="text-xs">
              Log {messageTypeCounts.log > 0 && `(${messageTypeCounts.log})`}
            </TabsTrigger>

            <TabsTrigger value="info" className="text-xs">
              Info {messageTypeCounts.info > 0 && `(${messageTypeCounts.info})`}
            </TabsTrigger>

            <TabsTrigger value="warn" className="text-xs">
              Warn {messageTypeCounts.warn > 0 && `(${messageTypeCounts.warn})`}
            </TabsTrigger>

            <TabsTrigger value="error" className="text-xs">
              Error{" "}
              {messageTypeCounts.error > 0 && `(${messageTypeCounts.error})`}
            </TabsTrigger>

            <TabsTrigger value="output" className="text-xs">
              Output{" "}
              {messageTypeCounts.output > 0 && `(${messageTypeCounts.output})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="p-3 space-y-1">
            {filteredMessages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No messages to display</p>

                <p className="text-xs mt-1">
                  Type a command below to get started
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className="group flex items-start gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getMessageIcon(message.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {showTimestamps && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      )}
                      {message.source && (
                        <Badge variant="outline" className="text-xs">
                          {message.source}
                        </Badge>
                      )}
                    </div>

                    <pre
                      className={`text-sm font-mono whitespace-pre-wrap break-words ${getMessageColor(
                        message.type
                      )}`}
                    >
                      {message.content}
                    </pre>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={() => copyMessage(message.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Command Input */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />

          <Input
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a command... (try 'help')"
            className="font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// Hook for managing console messages
export function useConsole() {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);

  const addMessage = useCallback(
    (type: ConsoleMessage["type"], content: string, source?: string) => {
      const newMessage: ConsoleMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type,
        content,
        timestamp: new Date(),
        source,
      };

      setMessages((prev) => [...prev, newMessage]);
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const log = useCallback(
    (content: string, source?: string) => addMessage("log", content, source),
    [addMessage]
  );
  const info = useCallback(
    (content: string, source?: string) => addMessage("info", content, source),
    [addMessage]
  );
  const warn = useCallback(
    (content: string, source?: string) => addMessage("warn", content, source),
    [addMessage]
  );
  const error = useCallback(
    (content: string, source?: string) => addMessage("error", content, source),
    [addMessage]
  );
  const success = useCallback(
    (content: string, source?: string) =>
      addMessage("success", content, source),
    [addMessage]
  );

  return {
    messages,
    addMessage,
    clearMessages,
    log,
    info,
    warn,
    error,
    success,
  };
}
