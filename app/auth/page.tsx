"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          // Verify token is still valid
          const response = await fetch("/api/auth/verify", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            // Token is valid, redirect to dashboard
            router.push("/dashboard");
            return;
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("rememberMe");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthError("Failed to verify authentication status");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLoginSuccess = () => {
    // This will be called from the LoginForm
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                Checking authentication...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-4">
        {authError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {isLogin ? (
          <LoginForm
            onToggleMode={() => setIsLogin(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}

        <Card className="text-center p-4">
          <p className="text-sm text-muted-foreground mb-2">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <Button variant="link" className="p-0 h-auto">
              Terms
            </Button>
            <Button variant="link" className="p-0 h-auto">
              Privacy
            </Button>
            <Button variant="link" className="p-0 h-auto">
              Support
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
