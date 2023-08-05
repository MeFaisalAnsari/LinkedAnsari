import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LinkedInPremium from "./assets/linkedin-premium.jpg";
import useUser from "./useUser";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";

const RightSidebar = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { user, loading } = useUser(currentUser.uid);

  if (loading) {
    return;
  }

  return (
    <div className="fixed w-80">
      <div className="bg-white rounded-lg overflow-hidden border py-4">
        <div className="flex justify-end gap-2 mb-2 px-3">
          <p className="text-sm">Ad</p>
          <MoreHorizIcon sx={{ fontSize: 20 }} />
        </div>
        <div className="text-center px-4 py-2">
          <p className="text-xs text-gray-500">
            {user.displayName}, boost your job search with Premium
          </p>
          <div className="flex justify-center items-center gap-3 my-4">
            <Avatar src={user?.photoURL} sx={{ width: 65, height: 65 }} />
            <img
              src={LinkedInPremium}
              alt="LinkedIn Premium"
              className="w-16"
            />
          </div>
          <p className="text-sm text-gray-700 mb-4">
            See who's viewed your profile in the last 90 days
          </p>
          <button className="py-2 px-6 text-sky-600 border border-sky-600 rounded-full text-sm font-semibold cursor-default">
            Try for free!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
