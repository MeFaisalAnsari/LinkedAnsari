import React from "react";
import Logo from "./Logo";
import loader from "./assets/puff.svg";

const Loading = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-6">
      <Logo />
      <img src={loader} />
    </div>
  );
};

export default Loading;
