import React from "react";
import LeftSidebar from "./LeftSidebar";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import Header from "./Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-stone-200 md:bg-stone-100">
      <Header />
      <div className="max-w-[1200px] mx-auto pt-16 pb-14 md:px-4 md:pt-20 md:pb-4">
        <div className="flex gap-6">
          <div className="hidden md:block w-60">
            <LeftSidebar />
          </div>
          <div className="flex-1">
            <Feed />
          </div>
          <div className="hidden lg:block w-80">
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
