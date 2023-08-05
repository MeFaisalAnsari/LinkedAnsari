import React, { useRef, useState } from "react";
import LinkedinIcon from "./assets/linkedin-icon.svg";
import SearchIcon from "@mui/icons-material/Search";
import SmsIcon from "@mui/icons-material/Sms";
import HomeIcon from "./assets/header-icons/home.svg";
import HomeActiveIcon from "./assets/header-icons/home-active.svg";
import NetworkIcon from "./assets/header-icons/network.svg";
import JobsIcon from "./assets/header-icons/jobs.svg";
import NotificationIcon from "./assets/header-icons/notification.svg";
import PostIcon from "./assets/header-icons/post.svg";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import NewPost from "./NewPost";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useClickAway } from "react-use";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const [isPosting, setIsPosting] = useState(false);
  const [toggleMe, setToggleMe] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const containerRef = useRef(null);
  const sidebarRef = useRef(null);
  const location = useLocation();

  useClickAway(containerRef, () => {
    setToggleMe(false);
  });

  useClickAway(sidebarRef, () => {
    setToggleSidebar(false);
  });

  if (isPosting || toggleSidebar) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  const isActive = (path) => {
    if (path === location.pathname) {
      return true;
    }
    return false;
  };

  return (
    <div className="bg-white shadow fixed top-0 w-full z-10">
      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center h-14 max-w-[1200px] mx-auto px-4">
        <div className="flex gap-1 items-center">
          <img src={LinkedinIcon} alt="LinkedIn" className="w-10" />
          <div className="flex items-center gap-1 bg-slate-100 p-2 rounded text-slate-600">
            <SearchIcon sx={{ fontSize: "20px" }} />
            <input
              type="text"
              className="w-56 bg-transparent text-sm placeholder:text-slate-500"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex w-[450px] h-full">
          <Link to="/" className="flex-1">
            <div
              className={`flex flex-col justify-center items-center h-full hover:text-black ${
                isActive("/")
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600"
              }`}
            >
              <img src={isActive("/") ? HomeActiveIcon : HomeIcon} />
              <div className="text-xs mt-[2px]">Home</div>
            </div>
          </Link>
          <div className="flex flex-col flex-1 justify-center items-center h-full text-gray-600">
            <img src={NetworkIcon} />
            <div className="text-xs mt-[2px]">My Network</div>
          </div>
          <div className="flex flex-col flex-1 justify-center items-center h-full text-gray-600">
            <img src={JobsIcon} />
            <div className="text-xs mt-[2px]">Jobs</div>
          </div>
          {/* <div className="flex flex-col flex-1 justify-center items-center h-full text-gray-600 hover:text-black cursor-pointer">
            <SmsIcon />
            <div className="text-xs">Messaging</div>
          </div> */}
          <div className="flex flex-col flex-1 justify-center items-center h-full text-gray-600">
            <img src={NotificationIcon} />
            <div className="text-xs mt-[2px]">Notifications</div>
          </div>
          <div
            className={`relative flex-1 flex flex-col justify-center items-center h-full cursor-pointer hover:text-black ${
              isActive(`/profile/${user.uid}`)
                ? "text-black border-b-2 border-black"
                : "text-gray-600"
            }`}
            onClick={() => setToggleMe(!toggleMe)}
            ref={containerRef}
          >
            <Avatar src={user?.photoURL} sx={{ width: 24, height: 24 }} />
            <div className="text-xs">
              Me <ArrowDropDownIcon className="-m-2" />
            </div>
            {toggleMe && (
              <div className="absolute top-11 left-0 bg-white rounded-lg shadow border z-10 whitespace-nowrap">
                <Link to={`/profile/${user.uid}`}>
                  <div className="text-sm cursor-pointer hover:bg-gray-100 py-2 px-6 text-slate-700 flex gap-2 items-center">
                    <PersonIcon sx={{ fontSize: 24 }} className="-ms-1" /> View
                    Profile
                  </div>
                </Link>
                <hr />
                <div
                  className="text-sm cursor-pointer hover:bg-gray-100 py-2 px-6 text-slate-700 flex gap-2 items-center"
                  onClick={() => signOut(auth)}
                >
                  <LogoutIcon sx={{ fontSize: 20 }} className="-ms-1" /> Sign
                  Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden h-14 gap-3 items-center justify-between px-4">
        <Avatar src={user?.photoURL} onClick={() => setToggleSidebar(true)} />
        <div className="flex flex-1 items-center gap-1 bg-slate-100 p-2 rounded text-slate-600">
          <SearchIcon sx={{ fontSize: "20px" }} />
          <input
            type="text"
            className="w-full bg-transparent text-sm placeholder:text-slate-500"
            placeholder="Search"
          />
        </div>
        <SmsIcon className="text-gray-600" />
      </div>

      {/* Mobile Sidebar */}

      <div
        className={`absolute top-0 left-0 bottom-0 right-0 h-screen w-full z-30 flex md:hidden transition-transform duration-500 ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="bg-white h-full w-[250px] flex flex-col justify-between"
          ref={sidebarRef}
        >
          <div className="p-6 border-b">
            <Link
              to={`/profile/${user.uid}`}
              onClick={() => setToggleSidebar(false)}
            >
              <Avatar src={user?.photoURL} sx={{ width: 65, height: 65 }} />
              <h4 className="mt-3 mb-1 font-semibold text-xl text-gray-900">
                {user.displayName}
              </h4>
              <p className="text-sm text-gray-500">View Profile</p>
            </Link>
          </div>
          <div
            className="p-6 border-t flex items-center gap-2 text-gray-700"
            onClick={() => signOut(auth)}
          >
            <LogoutIcon /> Sign Out
          </div>
        </div>
      </div>
      {toggleSidebar && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 w-full h-screen z-20 bg-[rgba(0,0,0,0.6)]"
          onClick={() => setToggleSidebar(false)}
        ></div>
      )}

      {/* Mobile Posting */}
      {isPosting && (
        <NewPost isPosting={isPosting} setIsPosting={setIsPosting} />
      )}

      {/* Mobile Bottom Icons */}
      <div className="flex md:hidden h-14 shadow justify-between bg-white fixed bottom-0 right-0 left-0 z-10 border-t">
        <Link to="/" className="flex-1">
          <div
            className={`flex flex-col items-center justify-center h-full hover:text-black ${
              isActive("/")
                ? "text-black border-t-2 border-black"
                : "text-gray-500"
            }`}
          >
            <img src={isActive("/") ? HomeActiveIcon : HomeIcon} />
            <div className="text-xs mt-[2px]">Home</div>
          </div>
        </Link>
        <div className="flex flex-col flex-1 items-center justify-center h-full text-gray-600 border-t-2 border-transparent">
          <img src={NetworkIcon} />
          <div className="text-xs mt-[2px]">My Network</div>
        </div>
        <div
          className="flex flex-col flex-1 items-center justify-center h-full text-gray-600 border-t-2 border-transparent"
          onClick={() => setIsPosting(true)}
        >
          <img src={PostIcon} />
          <div className="text-xs mt-[2px]">Post</div>
        </div>
        <div className="flex flex-col flex-1 items-center justify-center h-full text-gray-600 border-t-2 border-transparent">
          <img src={NotificationIcon} />
          <div className="text-xs mt-[2px]">Notifications</div>
        </div>
        <div className="flex flex-col flex-1 items-center justify-center h-full text-gray-600 border-t-2 border-transparent">
          <img src={JobsIcon} />
          <div className="text-xs mt-[2px]">Jobs</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
