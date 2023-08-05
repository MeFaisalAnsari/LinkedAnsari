import React from "react";
import Header from "./Header";
import ProfileMain from "./ProfileMain";
import ProfileSidebar from "./ProfileSidebar";

const Profile = () => {
  return (
    <div className="min-h-screen bg-stone-200 md:bg-stone-100">
      <Header />
      <div className="max-w-[1200px] mx-auto py-14 md:mb-0 md:px-4 md:pt-20 md:pb-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <ProfileMain />
          </div>
          <div className="hidden lg:block w-80">
            <ProfileSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
