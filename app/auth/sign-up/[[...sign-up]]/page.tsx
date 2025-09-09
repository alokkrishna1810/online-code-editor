import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-space-grotesk mb-2">
            Join CodeCollab
          </h1>
          <p className="text-muted-foreground">
            Create your account to start collaborating
          </p>
        </div>
        <SignUp
          routing="path"
          path="/auth/sign-up"
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
