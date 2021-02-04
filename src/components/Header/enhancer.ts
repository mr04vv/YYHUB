/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'interfaces/UserInterface';
import { signOut } from 'reduxes/modules/accounts/login';
import firebase from 'firebase';

export interface UseMyInfoInterface {
  userInfo: User | undefined;
  isLoading: boolean;
  logout: () => void;
  loginStatus: string | undefined;
}

export const useEnhancer = () => {
  const [userInfo, setUserInfo] = useState<User | undefined>();
  const userSelector = (state: any) => state.login;
  const userState = useSelector(userSelector);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [loginStatus, setLoginStatus] = useState<string | undefined>('');

  useEffect(() => {
    if (Object.keys(userState.data).length !== 0) {
      setUserInfo(userState.data);
      setIsLoading(false);
    }
    if (userState.status) {
      setLoginStatus(userState.status);
      setIsLoading(false);
    }
    if (userState.status === 'logout') {
      setUserInfo(undefined);
    }
  }, [userState]);

  const logout = () => {
    dispatch(signOut());
    firebase.auth().signOut();
    setLoginStatus('logout');
  };

  return {
    userInfo,
    isLoading,
    logout,
    loginStatus,
  };
};