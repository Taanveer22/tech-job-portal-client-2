import axios from 'axios';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import auth from '../firebase/init.js';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider();
  //✅ gmail issue step 1(scope)
  provider.addScope('email');

  // 1. Authentication Functions
  const googleSignin = () => {
    return signInWithPopup(auth, provider);
  };

  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signinUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signoutUser = () => {
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // 2. Lifecycle Effects
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // console.log('state captured', currentUser?.email || currentUser?.providerData?.[0]?.email);
      const capturedUserEmail = currentUser?.email || currentUser?.providerData?.[0]?.email;
      if (capturedUserEmail) {
        const tokenUser = { email: capturedUserEmail };
        axios
          .post(`http://localhost:5000/jwt/login`, tokenUser, { withCredentials: true })
          .then((res) => console.log(res.data));
      } else {
        axios
          .post(
            `http://localhost:5000/jwt/logout`,
            {},
            {
              withCredentials: true,
            }
          )
          .then((res) => console.log(res.data));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 3. Context Memoization (Prevents unnecessary re-renders)
  const authData = {
    googleSignin,
    registerUser,
    signinUser,
    updateUserProfile,
    signoutUser,
    user,
    loading,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
