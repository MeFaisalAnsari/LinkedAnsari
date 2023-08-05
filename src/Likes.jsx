import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import like from "./assets/reactions-filled/like.svg";
import celebrate from "./assets/reactions-filled/celebrate.svg";
import support from "./assets/reactions-filled/support.svg";
import love from "./assets/reactions-filled/love.svg";
import insightful from "./assets/reactions-filled/insightful.svg";
import funny from "./assets/reactions-filled/funny.svg";
import useUser from "./useUser";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

const Likes = ({ setShowLikes, likes }) => {
  const getReactionIcon = (reaction) => {
    switch (reaction) {
      case "like":
        return like;
      case "celebrate":
        return celebrate;
      case "support":
        return support;
      case "love":
        return love;
      case "insightful":
        return insightful;
      case "funny":
        return funny;
    }
  };
  return (
    <div className="bg-white md:bg-transparent z-20 fixed top-0 left-0 flex justify-center items-center w-full h-screen">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]"
        onClick={() => setShowLikes(false)}
      ></div>
      <div className="bg-white md:rounded-lg w-full h-full md:h-[80%] md:w-[500px] flex flex-col z-10">
        <div className="flex justify-between items-center p-6 border-b">
          <p className="text-xl text-gray-600">Reactions</p>
          <CloseIcon
            sx={{ fontSize: 32 }}
            className="text-gray-700 cursor-pointer"
            onClick={() => setShowLikes(false)}
          />
        </div>
        <div className="overflow-y-auto flex-1 h-full">
          {likes.map((like) => {
            const { user, loading } = useUser(like.uid);
            if (loading) {
              return;
            }
            return (
              <Link to={`/profile/${user.uid}`} key={like.uid}>
                <div className="flex gap-2 items-center py-3 hover:bg-gray-100 px-6">
                  <div className="relative">
                    <Avatar
                      src={user?.photoURL}
                      sx={{ width: 45, height: 45 }}
                    />
                    <img
                      src={getReactionIcon(like.reaction)}
                      className="absolute bottom-0 right-0 w-4"
                    />
                  </div>
                  <p>{user.displayName}</p>
                </div>
                <hr className="mx-6" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Likes;
