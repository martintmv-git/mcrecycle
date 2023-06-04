import React from "react";
import Head from "next/head";
import { SignInButton } from "@clerk/nextjs";

const StartPage = () => {
  return (
    <div className="signin-container">
      <Head>
        <title>Welcome to McRecycle</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <img src="/mcrecycle_logo.png" alt="McRecycle Logo" className="logo-signin"/>
      <div className="center-content content-container">
        <br></br>
        <br></br> 
        <h3>Welcome to McRecycle!</h3>
        <p>Click the button and choose a way to sign in.</p>
        <SignInButton className="signin-button"/>
      </div>
    </div>
  );
};

export default StartPage;