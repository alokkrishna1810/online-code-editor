"use client";

import { Button } from "@/components/ui/button";
import { Code2, Users, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-space-grotesk">
              CodeCollab
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold font-space-grotesk mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Code Together,
            <br />
            Create Better
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Professional online code editor with real-time collaboration. Write
            HTML, CSS, and JavaScript with your team, anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Start Coding Now
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-space-grotesk mb-2">
              Real-time Collaboration
            </h3>
            <p className="text-muted-foreground">
              Work together with your team in real-time. See cursors, edits, and
              changes instantly.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold font-space-grotesk mb-2">
              Lightning Fast
            </h3>
            <p className="text-muted-foreground">
              Powered by Monaco Editor with instant preview and blazing-fast
              performance.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold font-space-grotesk mb-2">
              Secure & Private
            </h3>
            <p className="text-muted-foreground">
              Your code is encrypted and secure. Share projects with confidence.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
