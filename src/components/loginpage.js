import { ClerkProvider, SignIn } from "@clerk/clerk-react";

function LoginPage() {
  return (
    <ClerkProvider frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}>
      <div>
        <SignIn />
      </div>
    </ClerkProvider>
  );
}

export default LoginPage;