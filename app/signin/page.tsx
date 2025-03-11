import SignInButton from "@/components/buttons/SignInButton";
import React from "react";

const signInPage = () => {
  return (
    <div className="grid place-items-center w-full h-screen signInBg">
      <div className="w-[90%] h-[50%] max-w-[500px] bg-[#f9f9f9] rounded-xl shadow-2xl flex flex-col gap-10 justify-center">
        <h2 className="font-bold text-4xl text-center">sign in</h2>
        <p className="text-center text-md font-semibold">
          Plese sign in with Google account.
        </p>
        <SignInButton />
      </div>
    </div>
  );
};

export default signInPage;
