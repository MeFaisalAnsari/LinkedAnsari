import { Avatar } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PublicIcon from "@mui/icons-material/Public";
import CircleIcon from "@mui/icons-material/Circle";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import SendIcon from "@mui/icons-material/Send";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { v4 as uuid } from "uuid";
import useUser from "./useUser";
import like from "./assets/reactions/like.png";
import celebrate from "./assets/reactions/celebrate.png";
import support from "./assets/reactions/support.png";
import love from "./assets/reactions/love.png";
import insightful from "./assets/reactions/insightful.png";
import funny from "./assets/reactions/funny.png";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useSelector } from "react-redux";
import Likes from "./Likes";
import Comment from "./Comment";
import { useClickAway } from "react-use";
import { Link } from "react-router-dom";

const Post = ({ post, deletePost }) => {
  const { user: author, loading } = useUser(post.authorId);
  const { user } = useSelector((state) => state.auth);
  const [reaction, setReaction] = useState("like");
  const [toggleReaction, setToggleReaction] = useState(false);
  const [reactionData, setReactionData] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [showLikes, setShowLikes] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [toggleMore, setToggleMore] = useState(false);
  const [toggleImage, setToggleImage] = useState(false);
  const deletePostRef = useRef(null);
  const reactionRef = useRef(null);

  useClickAway(deletePostRef, () => {
    setToggleMore(false);
  });

  useClickAway(reactionRef, () => {
    setToggleReaction(false);
  });

  if (showLikes) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  const colorHashtagsandLinks = (text) => {
    const hashtagRegex = /#[^\s#]+/g;
    const linkRegex = /(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*/g;

    return text
      .replace(hashtagRegex, (match) => {
        return `<span class="text-sky-600 cursor-default font-semibold hover:underline">${match}</span>`;
      })
      .replace(linkRegex, (match) => {
        return `<a href="${match}" target="_blank" class="text-sky-600 cursor-pointer hover:underline">${match}</a>`;
      });
  };

  const getReactionData = (reaction) => {
    switch (reaction) {
      case "like":
        return {
          icon: like,
          color: "text-sky-600",
        };
      case "celebrate":
        return {
          icon: celebrate,
          color: "text-lime-600",
        };
      case "support":
        return {
          icon: support,
          color: "text-purple-600",
        };
      case "love":
        return {
          icon: love,
          color: "text-red-600",
        };
      case "insightful":
        return {
          icon: insightful,
          color: "text-amber-600",
        };
      case "funny":
        return {
          icon: funny,
          color: "text-cyan-600",
        };
      default:
        return {
          icon: like,
          color: "text-sky-600",
        };
    }
  };

  useEffect(() => {
    const postRef = doc(db, "posts", post.postId);

    const postUnsubscribe = onSnapshot(postRef, (docSnapshot) => {
      const postData = docSnapshot.data();
      setLikes(postData.likes || []);
      setComments((postData.comments || []).reverse());
    });

    return () => postUnsubscribe();
  }, [post.postId]);

  useEffect(() => {
    const postRef = doc(db, "posts", post.postId);

    // Set up a real-time listener for the post document
    const unsubscribe = onSnapshot(postRef, (postSnap) => {
      if (postSnap.exists()) {
        const postData = postSnap.data();
        const filteredArray = postData.likes.filter(
          (like) => like.uid === user.uid
        );

        if (filteredArray.length > 0) {
          setIsLiked(true);
          setReaction(filteredArray[0].reaction);
          setReactionData(getReactionData(filteredArray[0].reaction));
        } else {
          setIsLiked(false);
        }
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [post.postId, user.uid]);

  const addReaction = async (reaction) => {
    try {
      const postRef = doc(db, "posts", post.postId);
      await updateDoc(postRef, {
        likes: arrayUnion({
          uid: user.uid,
          reaction: reaction,
        }),
      });

      setIsLiked(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeReaction = async () => {
    try {
      const postRef = doc(db, "posts", post.postId);
      const postSnap = await getDoc(postRef);
      const likes = postSnap.data().likes;
      const updatedLikes = likes.filter((like) => like.uid !== user.uid);
      await updateDoc(postRef, {
        likes: updatedLikes,
      });
      setIsLiked(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (e) => {
    if (e.key === "Enter") {
      setComment("");
      const postRef = doc(db, "posts", post.postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          commentId: uuid(),
          uid: user.uid,
          comment: comment,
        }),
      });
    }
  };

  const deleteComment = async (commentId) => {
    const postRef = doc(db, "posts", post.postId);
    const postSnap = await getDoc(postRef);
    const comments = postSnap.data().comments;
    const updatedComments = comments.filter(
      (comment) => comment.commentId !== commentId
    );
    await updateDoc(postRef, {
      comments: updatedComments,
    });
  };

  const formatRelativeTime = (timestamp) => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const year = week * 52;

    if (timestamp < minute) {
      return "now";
    } else if (timestamp < hour) {
      const minutes = Math.floor(timestamp / minute);
      return `${minutes}m`;
    } else if (timestamp < day) {
      const hours = Math.floor(timestamp / hour);
      return `${hours}h`;
    } else if (timestamp < week) {
      const days = Math.floor(timestamp / day);
      return `${days}d`;
    } else if (timestamp < year) {
      const weeks = Math.floor(timestamp / week);
      return `${weeks}w`;
    } else {
      const years = Math.floor(timestamp / year);
      return `${years}y`;
    }
  };

  if (loading) {
    return;
  }

  return (
    <div>
      {showLikes && <Likes setShowLikes={setShowLikes} likes={likes} />}
      <div className="bg-white md:rounded-lg md:border mb-2">
        <div className="flex justify-between p-4">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${author.uid}`}>
              <Avatar src={author?.photoURL} sx={{ width: 45, height: 45 }} />
            </Link>
            <div>
              <Link to={`/profile/${author.uid}`}>
                <h4 className="font-semibold text-gray-700 mb-1">
                  {author.displayName}
                </h4>
              </Link>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span>
                  {post.timestamp &&
                    formatRelativeTime(Date.now() - post.timestamp.toDate())}
                </span>
                <CircleIcon sx={{ fontSize: 4 }} />
                <PublicIcon sx={{ fontSize: 16 }} />
              </p>
            </div>
          </div>
          {user.uid === author.uid && (
            <div ref={deletePostRef} className="relative">
              <MoreHorizIcon
                className="text-gray-500 cursor-pointer"
                sx={{ fontSize: 20 }}
                onClick={() => setToggleMore(!toggleMore)}
              />
              {toggleMore && (
                <div className="absolute top-6 right-0 bg-white py-1 rounded shadow border z-10">
                  <div
                    className="text-sm cursor-pointer hover:bg-gray-100 py-2 px-4 text-slate-700 flex gap-2 items-center"
                    onClick={() => deletePost(post.postId)}
                  >
                    <DeleteIcon />
                    <span className="whitespace-nowrap">Delete post</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          {post.text && (
            <p
              className="px-4 text-sm text-gray-600 mb-4 whitespace-pre-wrap"
              style={{ overflowWrap: "anywhere" }}
              dangerouslySetInnerHTML={{
                __html: colorHashtagsandLinks(post.text),
              }}
            ></p>
          )}
          {post.image && (
            <img
              src={post.image}
              className={`w-full max-h-[130vw] md:max-h-[90vh] ${
                toggleImage ? "object-contain" : "object-cover"
              }`}
              onClick={() => setToggleImage(!toggleImage)}
            />
          )}
        </div>
        {(likes.length > 0 || comments.length > 0) && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 py-2 px-4">
              {likes.length > 0 && (
                <div
                  onClick={() => setShowLikes(true)}
                  className="cursor-pointer hover:text-sky-600 hover:underline"
                >
                  {likes.length} {likes.length > 1 ? "Reactions" : "Reaction"}
                </div>
              )}
              {comments.length > 0 && (
                <div
                  onClick={() => setShowComments(true)}
                  className="cursor-pointer hover:text-sky-600 hover:underline"
                >
                  {comments.length}{" "}
                  {comments.length > 1 ? "Comments" : "Comment"}
                </div>
              )}
            </div>
            <hr className="w-[95%] mx-auto border-gray-300" />
          </div>
        )}
        <div className="relative flex text-gray-500 py-3 md:py-2 md:px-6">
          {isLiked ? (
            <div
              className="flex-1 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 px-4 md:py-3 rounded-lg md:hover:bg-gray-100 cursor-pointer"
              onClick={removeReaction}
            >
              <img
                src={reactionData.icon}
                className="w-5 max-h-6 object-contain"
              />
              <span
                className={`text-xs md:text-sm font-semibold capitalize ${reactionData.color}`}
              >
                {reaction}
              </span>
            </div>
          ) : (
            <div
              className={`flex-1 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 px-4 md:py-3 rounded-lg md:hover:bg-gray-100 ${
                toggleReaction ? "md:bg-gray-100" : ""
              } cursor-pointer`}
              onClick={() => setToggleReaction(!toggleReaction)}
              ref={reactionRef}
            >
              <ThumbUpOutlinedIcon sx={{ fontSize: 20 }} />
              <span className="text-xs md:text-sm font-semibold">Like</span>
              {toggleReaction && (
                <div className="absolute bottom-full left-2 flex items-center gap-2 bg-white py-2 px-4 rounded-lg border shadow">
                  <img
                    src={like}
                    className="w-6 hover:scale-125"
                    onClick={() => addReaction("like")}
                  />
                  <img
                    src={celebrate}
                    className="w-7 hover:scale-125"
                    onClick={() => addReaction("celebrate")}
                  />
                  <img
                    src={support}
                    className="w-7 hover:scale-125"
                    onClick={() => addReaction("support")}
                  />
                  <img
                    src={love}
                    className="w-6 hover:scale-125"
                    onClick={() => addReaction("love")}
                  />
                  <img
                    src={insightful}
                    className="w-5 hover:scale-125"
                    onClick={() => addReaction("insightful")}
                  />
                  <img
                    src={funny}
                    className="w-6 hover:scale-125"
                    onClick={() => addReaction("funny")}
                  />
                </div>
              )}
            </div>
          )}
          <div
            className="flex-1 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 px-4 md:py-3 rounded-lg md:hover:bg-gray-100 cursor-pointer"
            onClick={() => setShowComments(true)}
          >
            <CommentOutlinedIcon sx={{ fontSize: 20 }} />
            <span className="text-xs md:text-sm font-semibold">Comment</span>
          </div>
          <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2 px-4 md:py-3 rounded-lg md:hover:bg-gray-100 cursor-default">
            <CachedRoundedIcon sx={{ fontSize: 20 }} />
            <span className="text-xs md:text-sm font-semibold">Repost</span>
          </div>
          <div className="flex-1 flex flex-col md:flex-row justify-center items-center gap-1 px-4 md:py-3 rounded-lg md:hover:bg-gray-100 cursor-default">
            <SendIcon
              sx={{ fontSize: 20 }}
              className="-rotate-45 md:mt-[-5px]"
            />
            <span className="text-xs md:text-sm font-semibold">Send</span>
          </div>
        </div>

        {showComments && (
          <div>
            <div className="flex px-4 gap-2 items-center pb-4">
              <Link to={`/profile/${user.uid}`}>
                <Avatar src={user?.photoURL} />
              </Link>
              <input
                type="text"
                placeholder="Add a comment"
                className="flex-1 border border-gray-300 p-3 rounded-full text-sm text-gray-700"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={addComment}
              />
            </div>
            {comments.map((comment, index) => {
              return (
                <Comment
                  comment={comment}
                  key={index}
                  deleteComment={deleteComment}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
