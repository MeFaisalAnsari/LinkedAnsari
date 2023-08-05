import React, { useState } from "react";
import Google from "./assets/google.png";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { auth, db } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/actions/authActions";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisibile] = useState(false);
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

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill out all the fields!");
      return;
    }

    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      dispatch(loginSuccess(userData(user)));
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);

      switch (error.code) {
        case "auth/user-not-found":
          alert(
            "The email address is not associated with any account. Please sign up first."
          );
          break;
        case "auth/invalid-email":
          alert("The email address is invalid.");
          break;
        case "auth/wrong-password":
          alert("Wrong Password!");
          break;
        default:
          alert("Something went wrong, please try again later.");
          break;
      }
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }

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
      <div className="sm:w-[400px] w-full bg-white text-gray-900 shadow-lg rounded-lg sm:p-8 p-6">
        <h4 className="text-3xl font-semibold text-center mb-5">Sign In</h4>
        <form>
          <input
            type="email"
            className="w-full border border-gray-500 rounded py-2 px-4 mb-3 placeholder:text-gray-500"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex border border-gray-500 rounded py-2 px-4 mb-4">
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
          <button
            type="submit"
            onClick={handleSignin}
            disabled={loading}
            className="w-full bg-sky-600 text-white px-4 py-3 rounded-full font-semibold"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <div className="flex items-center gap-3 my-3">
          <hr className="w-full border-gray-300" />
          <p>or</p>
          <hr className="w-full border-gray-300" />
        </div>
        <button
          className="flex w-full justify-center items-center gap-2 py-2 px-4 rounded-full border border-gray-700"
          onClick={handleGoogleSignin}
        >
          <img src={Google} className="w-5" />
          <span>Continue with Google</span>
        </button>
      </div>
      <p className="mt-5 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-sky-600">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default Signin;
