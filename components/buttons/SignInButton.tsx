"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

const SignInButton = () => {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="cursor-pointer hover:opacity-40"
    >
      <Image
        src="/buttons/GoogleSignIn.svg"
        alt="Googleサインイン"
        width={250}
        height={100}
        className="mx-auto"
      />
    </button>
  );
};

export default SignInButton;
