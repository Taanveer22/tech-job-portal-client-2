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

import BASE_URL from '../api/baseUrl';
import auth from '../firebase/init';
import logger from '../utilities/logger';
import AuthContext from './AuthContext';

// ======================================================
// GOOGLE LOGIN PROVIDER SETUP
// ======================================================
const provider = new GoogleAuthProvider();
provider.addScope('email'); // ensures email access from Google

const AuthProvider = ({ children }) => {
  // ======================================================
  // GLOBAL AUTH STATE
  // ======================================================
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // AUTH FUNCTIONS (USED IN APP)
  // ======================================================

  // Google login popup
  const googleSignin = () => signInWithPopup(auth, provider);

  // Create new account
  const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  // Login with email/password
  const signinUser = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Logout user (Firebase + backend JWT logout)
  const signoutUser = async () => {
    // remove JWT from backend
    await axios.post(`${BASE_URL}/jwt/logout`, {}, { withCredentials: true });

    logger.log('JWT logout success');

    // remove firebase session
    return signOut(auth);
  };

  // Update user profile (name + photo)
  const updateUserProfile = (name, photo) =>
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });

  // ======================================================
  // AUTH STATE LISTENER (RUNS ON APP START + LOGIN/LOGOUT)
  // ======================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); // start loading whenever auth changes

      try {
        // If user is logged out
        if (!currentUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Get email safely (Google + email/password both supported)
        const userEmail = currentUser.email || currentUser?.providerData?.[0]?.email;

        if (!userEmail) {
          setUser(null);
          setLoading(false);
          return;
        }

        // ======================================================
        // SEND EMAIL TO BACKEND → GET JWT COOKIE
        // (runs every login automatically)
        // ======================================================
        await axios.post(`${BASE_URL}/jwt/login`, { userEmail }, { withCredentials: true });

        logger.log('JWT login success');

        // Save user in global state
        setUser(currentUser);
      } catch (error) {
        logger.log('Auth error:', error);
        setUser(null); // reset user on error
      } finally {
        setLoading(false); // stop loading
      }
    });

    // cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // ======================================================
  // PROVIDER VALUE (AVAILABLE TO WHOLE APP)
  // ======================================================
  const authInfo = {
    googleSignin,
    registerUser,
    signinUser,
    signoutUser,
    updateUserProfile,
    user,
    loading,
  };
  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
