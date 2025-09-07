"use client";

import { Button } from "../ui/button";
import { Code2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";

export default function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-primary" />

          <span className="text-xl md:text-2xl font-bold font-space-grotesk">
            CodeCollab
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <Link href="/auth">
            <Button variant="ghost">Sign in</Button>
          </Link>

          <Link href="/dashboard" target="_blank">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
