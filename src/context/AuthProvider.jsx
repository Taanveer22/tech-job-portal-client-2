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

import BASE_URL from '../api/baseUrl.js';
import auth from '../firebase/init.js';
import logger from '../utilities/logger.js';
import AuthContext from './AuthContext';

// ======================================================
// GOOGLE PROVIDER SETUP
// ======================================================

// create google provider
const provider = new GoogleAuthProvider();

// request email permission
provider.addScope('email');

const AuthProvider = ({ children }) => {
  // ======================================================
  // STATES
  // ======================================================

  // stores firebase logged in user
  const [user, setUser] = useState(null);

  // loading state for auth checking
  const [loading, setLoading] = useState(true);

  // ======================================================
  // AUTH FUNCTIONS
  // ======================================================

  // google login
  const googleSignin = () => {
    return signInWithPopup(auth, provider);
  };

  // email/password register
  const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // email/password login
  const signinUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout user
  const signoutUser = async () => {
    try {
      // remove jwt cookie first
      await axios.post(
        `${BASE_URL}/jwt/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      logger.log('JWT logout success');
    } catch (error) {
      logger.log('JWT logout error:', error);
    }

    // then logout from firebase
    return signOut(auth);
  };

  // update firebase profile
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
    // listen for firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        // start loading
        setLoading(true);

        // ==================================================
        // LOGIN CASE
        // ==================================================

        if (currentUser) {
          // get user email safely
          const email = currentUser.email || currentUser?.providerData?.[0]?.email;

          // if email missing stop here
          if (!email) {
            setUser(null);
            setLoading(false);
            return;
          }

          // IMPORTANT:
          // create jwt cookie in backend first
          await axios.post(
            `${BASE_URL}/jwt/login`,
            { email },
            {
              withCredentials: true,
            }
          );

          // AFTER jwt success save user
          setUser(currentUser);

          logger.log('JWT login success');
        }

        // ==================================================
        // LOGOUT CASE
        // ==================================================
        else {
          // clear user from frontend
          setUser(null);

          logger.log('User logged out');
        }
      } catch (error) {
        // if jwt creation fails
        logger.log('Auth state error:', error);

        // clear invalid user
        setUser(null);
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

  // provide auth globally
  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
