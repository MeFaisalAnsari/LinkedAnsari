import { Avatar } from "@mui/material";
import React from "react";
import TurnedInRoundedIcon from "@mui/icons-material/TurnedInRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LinkedInBanner from "./assets/linkedin-banner.jpg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="fixed w-60">
      <div className="bg-white rounded-lg overflow-hidden border">
        <div
          className="pt-[25%] bg-cover bg-center"
          style={{ backgroundImage: `url(${LinkedInBanner})` }}
        ></div>
        <div className="text-center flex flex-col items-center mt-[-40px] px-3">
          <Link to={`/profile/${user.uid}`}>
            <Avatar src={user?.photoURL} sx={{ width: 70, height: 70 }} />
          </Link>
          <Link to={`/profile/${user.uid}`}>
            <h4 className="font-semibold text-gray-800 mt-4 mb-1">
              {user.displayName}
            </h4>
          </Link>
          <p className="text-xs text-gray-400 mb-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque
            natus rerum harum minus ullam.
          </p>
        </div>
        <hr />
        <div className="py-2">
          <div className="flex text-xs justify-between font-semibold cursor-default py-2 px-3 hover:bg-gray-100">
            <p className="text-gray-500">Who's viewed your profile</p>
            <p className="text-sky-600">203</p>
          </div>
          <div className="flex text-xs justify-between font-semibold cursor-default py-2 px-3 hover:bg-gray-100">
            <p className="text-gray-500">Impressions of your post</p>
            <p className="text-sky-600">5,826</p>
          </div>
        </div>
        <hr />
        <div className="py-2 px-3 flex gap-2 items-center text-xs text-gray-600 cursor-default hover:bg-gray-100">
          <TurnedInRoundedIcon />
          <p>My Items</p>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border mt-2 sticky top-0">
        <div className="pt-4 pb-3 text-xs">
          <h4 className="px-3 mb-2">Recent</h4>
          <div className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 py-1 px-4 cursor-default">
            <GroupsRoundedIcon />
            <p>JavaScript Developer</p>
          </div>
          <div className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 py-1 px-4 cursor-default">
            <GroupsRoundedIcon />
            <p>Frontend Developer Group</p>
          </div>
          <div className="flex items-center gap-2 text-gray-500 hover:bg-gray-100 py-1 px-4 cursor-default">
            <GroupsRoundedIcon />
            <p>Web Design and Development</p>
          </div>
        </div>
        <hr />
        <div className="py-3 px-4 text-center text-sm text-slate-500 hover:bg-gray-100 cursor-default">
          Discover more
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
