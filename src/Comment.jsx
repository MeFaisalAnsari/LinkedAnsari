import { Avatar } from "@mui/material";
import React, { useRef, useState } from "react";
import useUser from "./useUser";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useClickAway } from "react-use";
import { Link } from "react-router-dom";

const Comment = ({ comment, deleteComment }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { user, loading } = useUser(comment.uid);
  const [toggleMore, setToggleMore] = useState(false);

  const containerRef = useRef(null);
  useClickAway(containerRef, () => {
    setToggleMore(false);
  });

  const isLoggedIn = currentUser.uid === comment.uid;

  const handleDeleteComment = () => {
    deleteComment(comment.commentId);
    setToggleMore(false);
  };

  if (loading) {
    return;
  }

  return (
    <div className="flex px-4 gap-2 items-start pb-3">
      <Link to={`/profile/${user.uid}`}>
        <Avatar src={user?.photoURL} />
      </Link>
      <div className="flex-1 bg-gray-100 p-3 rounded">
        <div className="flex justify-between">
          <Link to={`/profile/${user.uid}`}>
            <h4 className="text-sm font-semibold mb-1 text-gray-700">
              {user.displayName}
            </h4>
          </Link>
          {isLoggedIn && (
            <div ref={containerRef} className="relative">
              <MoreHorizIcon
                className="text-gray-500 cursor-pointer"
                sx={{ fontSize: 20 }}
                onClick={() => setToggleMore(!toggleMore)}
              />
              {toggleMore && (
                <div className="absolute top-6 right-0 bg-white py-1 rounded shadow border z-10">
                  <div
                    className="text-sm cursor-pointer hover:bg-gray-100 py-2 px-4 text-slate-700 flex gap-2 items-center"
                    onClick={handleDeleteComment}
                  >
                    <DeleteIcon />
                    <span className="whitespace-nowrap">Delete comment</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">{comment.comment}</p>
      </div>
    </div>
  );
};

export default Comment;
