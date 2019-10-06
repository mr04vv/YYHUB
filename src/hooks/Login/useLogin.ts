/* eslint-disable no-console */
import firebase from 'firebase';
import { providerTwitter, providerGoogle } from 'index';
import {
  useState, useEffect,
} from 'react';
import useReactRouter from 'use-react-router';
import { signIn } from 'reduxes/modules/accounts/login';
import { useDispatch } from 'react-redux';


const useLogin = () => {
  const [isLoaggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uid, setUid] = useState<string>();
  const { history } = useReactRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const firebaseToken = await user.getIdToken();
            const userInfo = await dispatch(signIn(firebaseToken));
            console.debug(userInfo);
            console.debug(user);
            setUid(user.uid);
          } catch {
            history.push({
              pathname: '/login',
            });
          }
        } else {
          history.push({
            pathname: '/login',
          });
        }
      });
    })();
  }, [history, dispatch]);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await firebase.auth().signInWithPopup(providerGoogle);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const loginWithTwitter = async () => {
    setIsLoading(true);
    try {
      await firebase.auth().signInWithPopup(providerTwitter);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    firebase.auth().signOut();
    setIsLoggedIn(false);
  };

  return {
    isLoaggedIn,
    isLoading,
    loginWithTwitter,
    loginWithGoogle,
    uid,
    signOut,
  };
};

export default useLogin;
