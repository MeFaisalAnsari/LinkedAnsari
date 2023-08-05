import React, { useState } from "react";
import Google from "./assets/google.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { auth, db, storage } from "./firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/actions/authActions";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisibile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisibile(!passwordVisible);
  };

  const userData = (user) => {
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill out all the fields!");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytesResumable(storageRef, profileImage);
        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
          photoURL: downloadURL,
        });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: `${firstName} ${lastName}`,
          email: user.email,
          photoURL: downloadURL,
        });
      } else {
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
          photoURL: "",
        });

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: `${firstName} ${lastName}`,
          email: user.email,
          photoURL: "",
        });
      }

      dispatch(loginSuccess(userData(user)));
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);

      switch (error.code) {
        case "auth/email-already-in-use":
          alert("The email address is already in use.");
          break;
        case "auth/invalid-email":
          alert("The email address is invalid.");
          break;
        case "auth/weak-password":
          alert("Password should be atleast 6 characters long.");
          break;
        default:
          alert("Something went wrong, please try again later.");
          break;
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      dispatch(loginSuccess(userData(user)));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-stone-100 min-h-screen flex justify-center items-center flex-col p-4">
      <div className="mb-6">
        <Logo />
      </div>
      <div className="sm:w-[400px] w-full bg-white text-gray-700 shadow-lg rounded-lg sm:p-8 p-6">
        <h4 className="text-3xl font-semibold text-center mb-5 text-gray-900">
          Sign Up
        </h4>
        <form>
          <div className="flex mb-3 gap-3">
            <input
              type="text"
              className="w-full border border-gray-500 rounded py-2 px-4 placeholder:text-gray-500"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="w-full border border-gray-500 rounded py-2 px-4 placeholder:text-gray-500"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <input
            type="email"
            className="w-full border border-gray-500 rounded py-2 px-4 mb-3 placeholder:text-gray-500"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex border border-gray-500 rounded py-2 px-4 mb-3">
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full placeholder:text-gray-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <VisibilityOutlinedIcon />
              ) : (
                <VisibilityOffOutlinedIcon />
              )}
            </button>
          </div>
          <label
            htmlFor="profile"
            className="cursor-pointer flex items-center gap-3 justify-center mb-3"
          >
            <p>Choose Profile Image:</p>
            {profileImage ? (
              <Avatar
                sx={{ width: 50, height: 50 }}
                src={URL.createObjectURL(profileImage)}
              />
            ) : (
              <Avatar sx={{ width: 50, height: 50 }} />
            )}
          </label>
          <input
            type="file"
            id="profile"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
          <button
            type="submit"
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-sky-600 text-white px-4 py-3 rounded-full font-semibold"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex items-center gap-3 my-3">
          <hr className="w-full border-gray-300" />
          <p>or</p>
          <hr className="w-full border-gray-300" />
        </div>
        <button
          className="flex w-full justify-center items-center gap-2 py-2 px-4 rounded-full border border-gray-700"
          onClick={handleGoogleSignup}
        >
          <img src={Google} className="w-5" />
          <span>Continue with Google</span>
        </button>
      </div>
      <p className="mt-5 text-center">
        Already have an account?{" "}
        <Link to="/signin" className="text-sky-600">
          Signin
        </Link>
      </p>
    </div>
  );
};

export default Signup;
