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
  // GOOGLE LOGIN → JWT login ও করবে
  // ======================================================
  const googleSignin = async () => {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email || result.user.providerData?.[0]?.email;
    await jwtLogin(email);
    logger.log('JWT login success (Google)');
    return result;
  };

  // ======================================================
  // EMAIL/PASSWORD REGISTER → JWT login ও করবে
  // ======================================================
  const registerUser = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await jwtLogin(email);
    logger.log('JWT login success (Register)');
    return result;
  };

  // ======================================================
  // EMAIL/PASSWORD LOGIN → JWT login ও করবে
  // ======================================================
  const signinUser = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await jwtLogin(email);
    logger.log('JWT login success (Email)');
    return result;
  };

  // ======================================================
  // LOGOUT → JWT logout ও করবে
  // ======================================================
  const signoutUser = async () => {
    await jwtLogout();
    logger.log('JWT logout success');
    return signOut(auth);
  };

  // ======================================================
  // UPDATE PROFILE
  // ======================================================
  const updateUserProfile = (name, photo) =>
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });

  // ======================================================
  // AUTH STATE LISTENER — শুধু user set করবে, JWT নয়
  // ======================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ?? null);
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
