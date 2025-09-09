import type React from "react";
import type { Metadata } from "next";
import { Geist, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { LiveblocksProviderWrapper } from "@/components/liveblocks/liveblocks-provider";
import { ClerkProviderWrapper } from "@/components/clerk-provider";
import Footer from "@/components/footer/footer";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "CodeCollab - Online Code Editor",
  description: "Professional online code editor with real-time collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${manrope.variable} antialiased`}
    >
      <body className="font-sans antialiased transition-theme min-h-screen flex flex-col">
        <ClerkProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <LiveblocksProviderWrapper>
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </LiveblocksProviderWrapper>
          </ThemeProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
