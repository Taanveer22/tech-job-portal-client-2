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

const provider = new GoogleAuthProvider();
provider.addScope('email');

// ======================================================
// JWT HELPERS
// ======================================================

const jwtLogin = (email) =>
  axios.post(`${BASE_URL}/jwt/login`, { email }, { withCredentials: true });

const jwtLogout = () => axios.post(`${BASE_URL}/jwt/logout`, {}, { withCredentials: true });

// ======================================================
// AUTH PROVIDER
// ======================================================

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // GOOGLE LOGIN — শুধু Firebase
  // ======================================================
  const googleSignin = () => signInWithPopup(auth, provider);

  // ======================================================
  // EMAIL/PASSWORD REGISTER — শুধু Firebase
  // ======================================================
  const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  // ======================================================
  // EMAIL/PASSWORD LOGIN — শুধু Firebase
  // ======================================================
  const signinUser = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // ======================================================
  // LOGOUT — শুধু Firebase
  // jwtLogout onAuthStateChanged এ হবে automatically
  // ======================================================
  const signoutUser = () => signOut(auth);

  // ======================================================
  // UPDATE PROFILE
  // ======================================================
  const updateUserProfile = (name, photo) =>
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });

  // ======================================================
  // AUTH STATE LISTENER
  // সব JWT কাজ শুধু এখানেই হবে
  // ======================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // ✅ user আছে — set করো
        setUser(currentUser);

        // ✅ JWT cookie সেট করো
        const email = currentUser.email || currentUser.providerData?.[0]?.email;

        try {
          await jwtLogin(email);
          logger.log('JWT login success');
        } catch (err) {
          logger.log('JWT login failed', err);
        }
      } else {
        // ✅ user নেই — clear করো
        setUser(null);

        // ✅ JWT cookie clear করো
        try {
          await jwtLogout();
          logger.log('JWT logout success');
        } catch (err) {
          logger.log('JWT logout failed', err);
        }
      }

      // ✅ সবশেষে loading false
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
