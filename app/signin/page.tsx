"use client";

import SignInButton from "@/components/buttons/SignInButton";
import Spinner from "@/components/elements/Spinner";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

const SignInPage = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google sign-in error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen grid place-items-center bg-[#e6e6fa]">
          <Spinner />
        </div>
      ) : (
        <div className="grid place-items-center w-full h-screen signInBg">
          <div className="w-[90%] h-[50%] max-w-[500px] bg-[#f9f9f9] rounded-xl shadow-2xl flex flex-col gap-10 justify-center">
            <h2 className="font-bold text-4xl text-center">sign in</h2>
            <p className="text-center text-md font-semibold">
              Plese sign in with Google account.
            </p>
            <SignInButton handleGoogleSignIn={handleGoogleSignIn} />
          </div>
        </div>
      )}
    </>
  );
};

export default SignInPage;
