import { useState, useEffect } from 'react';
import { getToken, decodeToken } from './token';
import type { DecodedToken } from './types';

export const useAuth = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      if (token) {
        const decoded = decodeToken(token);
        setDecodedToken(decoded);
      } else {
        setDecodedToken(null);
      }
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return {
    decodedToken,
    isAuthenticated: !!decodedToken?.userId,
    isLoading,setDecodedToken
  };
};