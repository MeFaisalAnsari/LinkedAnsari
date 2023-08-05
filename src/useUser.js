import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const useUser = (uid) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setUser(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUser(docSnapshot.data());
          setError(null);
        } else {
          setUser(null);
          setError("User not found");
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    // const fetchUser = async () => {
    //   try {
    //     const docRef = doc(db, "users", uid);
    //     const userSnapshot = await getDoc(docRef);
    //     if (userSnapshot.exists()) {
    //       setUser(userSnapshot.data());
    //     } else {
    //       setUser(null);
    //       setError("User not found");
    //     }
    //   } catch (error) {
    //     setUser(null);
    //     setError(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchUser();

    return () => unsubscribe();
  }, [uid]);

  return { user, loading, error };
};

export default useUser;
