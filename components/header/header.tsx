"use client";

import { Button } from "../ui/button";
import { Code2, Home, Code, BarChart3, Settings, Menu, X } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    if ((href === "/editor" || href === "/dashboard") && !isSignedIn) {
      router.push("/auth/sign-in");
    } else if ((href === "/auth/sign-in" || href === "/auth/sign-up") && isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push(href);
    }
  };

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/editor", label: "Editor", icon: Code },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-xl md:text-2xl font-bold font-space-grotesk">
              CodeCollab
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <SignedIn>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </SignedIn>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <SignedOut>
            <div className="hidden sm:flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <Button size="sm" onClick={() => handleNavigation("/auth/sign-up")}>
                Get Started
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-sm text-muted-foreground">
                Welcome back,{" "}
                <span className="font-medium text-foreground">
                  {user?.firstName || user?.username || "User"}
                </span>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          </SignedIn>

          {/* Mobile Menu Button */}
          <SignedIn>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </SignedIn>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <SignedIn>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                <button
                  key={item.href}
                  onClick={() => {
                    handleNavigation(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveLink(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
                  );
                })}
                <div className="pt-2 border-t mt-4">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.firstName?.[0] || user?.username?.[0] || "U"}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {user?.firstName || user?.username || "User"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        )}
      </SignedIn>
    </header>
  );
}
