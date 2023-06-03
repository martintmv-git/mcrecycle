import React from "react";
import Head from "next/head";
import { SignInButton } from "@clerk/nextjs";

const StartPage = () => {
  return (
    <div>
      <Head>
        <title>Welcome</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div>
        <p>Please use the button below to sign in to play the game</p>
        <SignInButton />
      </div>
    </div>
  );
};

export default StartPage;
