"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#000000",
        },
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          card: "shadow-lg",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
