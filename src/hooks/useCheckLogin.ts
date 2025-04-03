'use client';

import { USER } from '@/data/data';
import { useEffect, useState } from 'react';

export default function useCheckLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<USER>();

  useEffect(() => {
    const user = localStorage.getItem('user') || '{}';
    const parsedUser = JSON.parse(user);
    setLoginData(parsedUser);
    setIsLoggedIn(parsedUser?.username ? true : false);
  }, []);

  return {
    isLoggedIn,
    loginData,
  };
}
