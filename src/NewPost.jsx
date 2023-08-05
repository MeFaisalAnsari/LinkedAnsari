import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import { Avatar } from "@mui/material";
import Loader from "./assets/oval.svg";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "./firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";

const NewPost = ({ isPosting, setIsPosting }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePrev, setImagePrev] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePrev(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setImagePrev(null);
    }
  };

  const handlePostSubmit = async () => {
    if (!text && !image) {
      return;
    }

    setLoading(true);

    let imageUrl = "";

    try {
      if (image) {
        const storageRef = ref(storage, image.name);
        await uploadBytesResumable(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
      const postId = uuid();
      const docRef = doc(db, "posts", postId);
      await setDoc(docRef, {
        postId: postId,
        authorId: user.uid,
        text: text,
        image: imageUrl,
        likes: [],
        comments: [],
        timestamp: serverTimestamp(),
      });

      setText("");
      setImage(null);
      setIsPosting(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white md:bg-transparent z-20 fixed top-0 left-0 flex justify-center items-center w-full h-screen overflow-y-auto">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.7)]"
        onClick={() => setIsPosting(false)}
      ></div>
      <div className="bg-white md:rounded-lg w-full h-full md:h-auto md:w-[700px] relative flex flex-col">
        <div
          className="absolute right-6 top-6 cursor-pointer"
          onClick={() => setIsPosting(false)}
        >
          <CloseIcon sx={{ fontSize: 32 }} className="text-gray-700" />
        </div>
        <div className="flex items-center gap-2 p-6">
          <Avatar src={user?.photoURL} />
          <h4 className="font-semibold text-gray-700">{user.displayName}</h4>
        </div>
        <div className="px-6 flex-1 flex flex-col justify-between mt-5">
          <div className="flex-1">
            <textarea
              className={`w-full outline-none h-full resize-none ${
                imagePrev ? "md:h-28" : "md:h-40"
              }`}
              placeholder="What do you want to talk about?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          <div className="my-5">
            {imagePrev && (
              <div className="flex justify-center mb-5 md:mb-[-50px]">
                <img
                  src={imagePrev}
                  className="max-h-[40vh] md:max-h-40 max-w-[100%]"
                />
              </div>
            )}
            <label
              htmlFor="file"
              className="inline-block text-gray-400 bg-gray-100 p-4 rounded-full cursor-pointer hover:shadow"
            >
              <PhotoSizeSelectActualIcon />
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="text-end py-4 px-6 border-t">
          <button
            className="text-white font-semibold bg-sky-600 py-1 px-4 rounded-full"
            onClick={handlePostSubmit}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span>Posting</span>
                <img src={Loader} className="w-4" />
              </div>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
