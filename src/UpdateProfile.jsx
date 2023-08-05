import React, { useState } from "react";
import Loader from "./assets/oval.svg";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LinkedInAvatar from "./assets/linkedin-avatar.svg";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import { loginSuccess } from "./redux/actions/authActions";
import { useDispatch } from "react-redux";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const UpdateProfile = ({ setIsUpdating, user }) => {
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();

  const handleUpdateProfile = async () => {
    if (!displayName) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytesResumable(storageRef, profileImage);
        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: downloadURL,
        });

        await updateDoc(userRef, {
          displayName: displayName,
          photoURL: downloadURL,
        });
        const updatedUserData = {
          ...user,
          displayName: displayName,
          photoURL: downloadURL,
        };
        dispatch(loginSuccess(updatedUserData));
      } else {
        await updateDoc(userRef, {
          displayName: displayName,
        });
        const updatedUserData = { ...user, displayName: displayName };
        dispatch(loginSuccess(updatedUserData));
      }

      setIsUpdating(false);
    } catch (error) {
      console.log("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white md:bg-transparent z-20 fixed top-0 left-0 flex justify-center items-center w-full h-screen">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]"
        onClick={() => setIsUpdating(false)}
      ></div>
      <div className="bg-white md:rounded-lg w-full h-full md:h-[80%] md:w-[500px] flex flex-col z-10">
        <div className="flex justify-between items-center p-6 border-b">
          <p className="text-xl text-gray-600">Update Profile</p>
          <CloseIcon
            sx={{ fontSize: 32 }}
            className="text-gray-700 cursor-pointer"
            onClick={() => setIsUpdating(false)}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <div
            className="relative w-40 h-40 rounded-full overflow-hidden"
            style={{ background: `url(${LinkedInAvatar})` }}
          >
            <label htmlFor="image" className="cursor-pointer">
              <img
                src={
                  profileImage
                    ? URL.createObjectURL(profileImage)
                    : user?.photoURL
                }
                className="w-full"
              />
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center text-white">
                <CameraAltIcon sx={{ fontSize: 40 }} />
              </div>
            </label>
          </div>
          <input
            type="file"
            id="image"
            accept="image/*"
            className="hidden"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Display Name"
            className="border border-gray-500 py-2 px-4 text-gray-700 rounded-full text-center mt-6"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="text-end py-4 px-6 border-t">
          <button
            className="text-white font-semibold bg-sky-600 py-1 px-4 rounded-full"
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span>Updating</span>
                <img src={Loader} className="w-4" />
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
