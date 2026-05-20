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

// ======================================================
// GOOGLE PROVIDER
// ======================================================

// create google provider
const provider = new GoogleAuthProvider();

// request email permission
provider.addScope('email');

const AuthProvider = ({ children }) => {
  // ======================================================
  // STATES
  // ======================================================

  // stores logged in user
  const [user, setUser] = useState(null);

  // loading state
  const [loading, setLoading] = useState(true);

  // ======================================================
  // PREVENT DUPLICATE LOGIN / LOGOUT REQUESTS
  // ======================================================

  const lastAuthState = useRef(null);

  // ======================================================
  // AUTH FUNCTIONS
  // ======================================================

  // google signin
  const googleSignin = () => {
    return signInWithPopup(auth, provider);
  };

  // register user
  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // login user
  const signinUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout user
  const signoutUser = () => {
    return signOut(auth);
  };

  // update user profile
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // ======================================================
  // FIREBASE AUTH LISTENER
  // ======================================================

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // save firebase user
      setUser(currentUser);

      // ======================================================
      // LOGIN CASE
      // ======================================================

      if (currentUser) {
        try {
          // get email safely
          const email = currentUser.email || currentUser?.providerData?.[0]?.email;

          // stop if email missing
          if (!email) {
            setLoading(false);
            return;
          }

          // prevent duplicate login requests
          if (lastAuthState.current !== 'login') {
            // save auth state
            lastAuthState.current = 'login';

            // IMPORTANT:
            // wait until backend creates JWT cookie
            await axios.post(
              `${BASE_URL}/jwt/login`,
              { email },
              {
                withCredentials: true,
              }
            );

            logger.log('JWT login success');
          }
        } catch (error) {
          logger.log('JWT login error:', error);
        } finally {
          // IMPORTANT:
          // stop loading ONLY after JWT finishes
          setLoading(false);
        }

        return;
      }

      // ======================================================
      // LOGOUT CASE
      // ======================================================

      try {
        // prevent duplicate logout requests
        if (lastAuthState.current !== 'logout') {
          // save logout state
          lastAuthState.current = 'logout';

          // remove JWT cookie from backend
          await axios.post(
            `${BASE_URL}/jwt/logout`,
            {},
            {
              withCredentials: true,
            }
          );

          logger.log('JWT logout success');
        }
      } catch (error) {
        logger.log('JWT logout error:', error);
      } finally {
        // stop loading
        setLoading(false);
      }
    });

    // cleanup listener
    return () => {
      unsubscribe();
    };
  }, []);

  // ======================================================
  // CONTEXT VALUE
  // ======================================================

  const authData = {
    googleSignin,
    registerUser,
    signinUser,
    signoutUser,
    updateUserProfile,
    user,
    loading,
  };

  // provide auth data globally
  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
