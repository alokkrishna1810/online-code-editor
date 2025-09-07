"use client";

import { LiveblocksProvider } from "@liveblocks/react";
import { ReactNode } from "react";

interface LiveblocksProviderProps {
  children: ReactNode;
}

export function LiveblocksProviderWrapper({
  children,
}: LiveblocksProviderProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      {children}
    </LiveblocksProvider>
  );
}
