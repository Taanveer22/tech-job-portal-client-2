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
import { useEffect, useRef, useState } from 'react';

import BASE_URL from '../api/baseUrl.js';
import auth from '../firebase/init.js';
import logger from '../utilities/logger.js';
import AuthContext from './AuthContext';

// Create Google login provider
const provider = new GoogleAuthProvider();

// Allow email access from Google login step 1
provider.addScope('email');

const AuthProvider = ({ children }) => {
  // ---------------- STATE ----------------

  // store logged-in user (null if not logged in)
  const [user, setUser] = useState(null);

  // loading is true until Firebase finishes checking login state
  const [loading, setLoading] = useState(true);

  // ---------------- HELPER (ANTI-DUPLICATE) ----------------

  // This keeps track of last auth action (login or logout)
  // It helps prevent duplicate API calls
  const lastAuthState = useRef(null);

  // ---------------- AUTH FUNCTIONS ----------------

  // Google login function
  const googleSignin = () => {
    return signInWithPopup(auth, provider);
  };

  // Create new user with email + password
  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login existing user
  const signinUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout user from Firebase
  const signoutUser = () => {
    return signOut(auth);
  };

  // Update user profile (name, photo)
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // ---------------- AUTH LISTENER ----------------

  useEffect(() => {
    // Firebase listens for login/logout changes automatically
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Save user in state (used in UI)
      setUser(currentUser);

      // stop loading spinner
      setLoading(false);

      // ---------------- LOGIN CASE ----------------
      if (currentUser) {
        // get user email safely
        const email = currentUser.email || currentUser?.providerData?.[0]?.email;

        // if email not found, stop here
        if (!email) return;

        // prevent sending login request again and again
        if (lastAuthState.current === 'login') return;

        // mark state as login
        lastAuthState.current = 'login';

        // send email to backend → get JWT cookie
        axios
          .post(`${BASE_URL}/jwt/login`, { email }, { withCredentials: true })
          .then((res) => {
            logger.log('JWT login success:', res.data);
          })
          .catch((err) => {
            logger.log('JWT login error:', err);
          });

        return; // stop here (important)
      }

      // ---------------- LOGOUT CASE ----------------

      // if already processed logout, do nothing
      if (lastAuthState.current === 'logout') return;

      // mark state as logout
      lastAuthState.current = 'logout';

      // call backend to remove JWT cookie
      axios
        .post(`${BASE_URL}/jwt/logout`, {}, { withCredentials: true })
        .then((res) => {
          logger.log('JWT logout success:', res.data);
        })
        .catch((err) => {
          logger.log('JWT logout error:', err);
        });
    });

    // cleanup function (runs when component unmounts)
    return () => {
      unsubscribe();
    };
  }, []);

  // ---------------- DATA SENT TO APP ----------------

  const authData = {
    googleSignin,
    registerUser,
    signinUser,
    updateUserProfile,
    signoutUser,
    user,
    loading,
  };

  // Provide all auth functions + user to whole app
  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
