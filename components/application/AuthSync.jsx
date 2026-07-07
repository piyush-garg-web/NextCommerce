'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { login } from '@/store/reducer/authReducer';

export default function AuthSync({ children }) {
  const auth = useSelector((store) => store.authStore.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const syncAuth = async () => {
      try {
        const { data: response } = await axios.get('/api/auth/me');
        if (response.success && response.data) {
          dispatch(login(response.data));
        }
      } catch (error) {
        // Not logged in or invalid cookie, do nothing
      }
    };
    if (!auth) {
      syncAuth();
    }
  }, [auth, dispatch]);

  return <>{children}</>;
}
