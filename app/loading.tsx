import Spinner from "@/components/elements/Spinner";
import React from "react";

const loading = () => {
  return (
    <div className="w-full h-screen grid place-items-center bg-[#e6e6fa]">
      <Spinner />
    </div>
  );
};

export default loading;
