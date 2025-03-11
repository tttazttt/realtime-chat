import Image from "next/image";

const SignInButton = ({
  handleGoogleSignIn,
}: {
  handleGoogleSignIn: () => void;
}) => {
  return (
    <button
      onClick={handleGoogleSignIn}
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
