import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LinkedInAvatar from "./assets/linkedin-avatar.svg";
import LinkedInBanner from "./assets/linkedin-banner.jpg";
import useUser from "./useUser";
import UpdateProfile from "./UpdateProfile";

const ProfileMain = () => {
  const { uid } = useParams();
  const { user, loading, error } = useUser(uid);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  if (isUpdating) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  if (loading) {
    return;
  }
  if (error) {
    navigate("/");
    return;
  }

  const isLoggedIn = currentUser.uid === user.uid;

  return (
    <div>
      {isUpdating && (
        <UpdateProfile setIsUpdating={setIsUpdating} user={user} />
      )}
      <div className="bg-white md:rounded-lg md:border overflow-hidden">
        <div
          className="flex justify-center items-center pt-[25%] bg-cover bg-center"
          style={{ backgroundImage: `url(${LinkedInBanner})` }}
        ></div>
        <div>
          <div className="flex justify-between items-end px-4 md:px-6 -mt-16 md:-mt-28">
            <div className="h-28 w-28 md:h-40 md:w-40 overflow-hidden flex items-center rounded-full border-white border-4">
              <img
                src={user?.photoURL ? user.photoURL : LinkedInAvatar}
                className="w-full h-full object-cover"
              />
            </div>
            {isLoggedIn && (
              <div
                className="text-gray-500 hover:bg-gray-100 rounded-full p-2 cursor-pointer -m-2"
                onClick={() => setIsUpdating(!isUpdating)}
              >
                <EditOutlinedIcon />
              </div>
            )}
          </div>
          <div className="mt-4 px-4 md:px-6">
            <h2 className="font-semibold text-2xl text-gray-900">
              {user.displayName}
            </h2>
            <p className="text-gray-700">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni
              natus, sed asperiores totam atque tenetur architecto facilis
              aliquid.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Connecting and Messaging feature is not available
            </p>
            <div className="flex gap-2 mt-6 mb-8 flex-wrap">
              <button className="text-white bg-sky-600 py-1 px-4 rounded-full font-semibold cursor-default">
                {isLoggedIn ? (
                  "Open to"
                ) : (
                  <>
                    <PersonAddIcon sx={{ fontSize: 20 }} /> Connect
                  </>
                )}
              </button>
              <button className="text-sky-600 py-1 px-4 border border-sky-600 rounded-full font-semibold cursor-default">
                {isLoggedIn ? "Add profile section" : "Message"}
              </button>
              <button className="text-gray-500 py-1 px-4 border border-gray-500 rounded-full font-semibold cursor-default">
                More
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white md:rounded-lg md:border p-6 mt-2">
        <h4 className="text-xl font-semibold text-gray-900">About</h4>
        <p className="text-sm text-gray-700 mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
          perferendis quas natus possimus, earum fuga recusandae saepe
          voluptatem tempora libero!
        </p>
        <p className="text-sm text-gray-700 mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem quibusdam
          voluptatem placeat eos illo dolore sequi eius, laudantium harum porro
          dignissimos veritatis repellendus. Deleniti neque sunt dolor harum
          consequatur! Numquam provident nostrum dolore molestias illum
          consequuntur eum fugit id laboriosam!
        </p>
        <p className="text-sm text-gray-700 mt-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos sit
          placeat aliquam voluptatibus assumenda ad harum laboriosam ducimus
          nihil doloremque eligendi magnam possimus, fugiat vel.
        </p>
      </div>
    </div>
  );
};

export default ProfileMain;
