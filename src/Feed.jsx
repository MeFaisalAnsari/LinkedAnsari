import { Avatar } from "@mui/material";
import React, { useState } from "react";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import NewPost from "./NewPost";
import Posts from "./Posts";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Feed = () => {
  const { user } = useSelector((state) => state.auth);
  const [isPosting, setIsPosting] = useState(false);

  if (isPosting) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return (
    <div>
      {isPosting && (
        <NewPost isPosting={isPosting} setIsPosting={setIsPosting} />
      )}
      <div className="hidden md:block bg-white rounded-lg border">
        <div className="flex items-center p-4 gap-3">
          <Link to={`/profile/${user.uid}`}>
            <Avatar src={user?.photoURL} sx={{ width: 45, height: 45 }} />
          </Link>
          <div
            className="border border-gray-400 rounded-full py-3 px-4 flex-1 text-sm text-gray-500 cursor-pointer"
            onClick={() => setIsPosting(true)}
          >
            Start a post
          </div>
        </div>
        <div className="flex justify-between px-8 mb-4">
          <div
            className="flex items-center gap-2 rounded-lg py-3 px-4 cursor-pointer hover:bg-gray-100"
            onClick={() => setIsPosting(true)}
          >
            <PhotoSizeSelectActualIcon className="text-sky-500" />
            <p className="text-gray-500 text-sm">Photo</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg py-3 px-4 cursor-default hover:bg-gray-100">
            <SmartDisplayIcon className="text-lime-600" />
            <p className="text-gray-500 text-sm">Video</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg py-3 px-4 cursor-default hover:bg-gray-100">
            <CalendarMonthIcon className="text-yellow-600" />
            <p className="text-gray-500 text-sm">Event</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg py-3 px-4 cursor-default hover:bg-gray-100">
            <NewspaperIcon className="text-orange-600" />
            <p className="text-gray-500 text-sm">Write article</p>
          </div>
        </div>
      </div>

      <hr className="my-3 border-slate-300 hidden md:block" />

      <Posts />
    </div>
  );
};

export default Feed;
