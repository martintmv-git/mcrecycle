import { SignIn, SignInButton } from "@clerk/nextjs";
import React from "react";

const Home = () => {
  return (
    <>
      <main>
        <div>
          <SignInButton />
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};

export default Home;
