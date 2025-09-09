import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-space-grotesk mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to continue to CodeCollab
          </p>
        </div>
        <SignIn
          routing="path"
          path="/auth/sign-in"
          appearance={{
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#000000",
            },
            elements: {
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              card: "shadow-lg border",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
