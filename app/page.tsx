"use client";

import Header from "@/components/header/header";
import Hero from "@/components/hero/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <Hero />
    </div>
  );
}
