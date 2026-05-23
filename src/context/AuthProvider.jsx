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
  // BUG 4 FIX — prevUserRef দিয়ে track করো আগে user ছিল কিনা
  // page first load এ user=null → আগে logout call যেত → 401 error হতো
  // এখন শুধু আগে user ছিল তখনই jwtLogout call হবে
  // ======================================================
  const prevUserRef = useRef(null);

  // ======================================================
  // GOOGLE LOGIN
  // ======================================================
  const googleSignin = () => signInWithPopup(auth, provider);

  // ======================================================
  // EMAIL/PASSWORD REGISTER
  // ======================================================
  const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  // ======================================================
  // EMAIL/PASSWORD LOGIN
  // ======================================================
  const signinUser = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // ======================================================
  // LOGOUT
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
  // ======================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const email = currentUser.email || currentUser.providerData?.[0]?.email;
          await jwtLogin(email);
          setUser(currentUser);
          // ✅ prevUserRef update করো
          prevUserRef.current = currentUser;
          logger.log('JWT login success');
        } else {
          setUser(null);
          if (prevUserRef.current) {
            try {
              await jwtLogout();
              logger.log('JWT logout success');
            } catch (err) {
              logger.log('JWT logout failed', err);
            }
            prevUserRef.current = null;
          }
        }
      } catch (err) {
        logger.log('JWT login failed', err);
        if (currentUser) {
          setUser(currentUser);
        }
      } finally {
        setLoading(false);
      }
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
