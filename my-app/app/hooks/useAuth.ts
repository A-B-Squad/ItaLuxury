import { decodeToken, getToken, removeToken } from '@/utils/tokens/token';
import type { DecodedToken } from '@/utils/tokens/types';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useTokenRefresh } from './useTokenRefresh';

export const useAuth = () => {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [skipRefreshCheck, setSkipRefreshCheck] = useState(false);
  const { checkAndRefreshToken } = useTokenRefresh();
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    setIsLoading(true);

    const token = getToken();
    if (!token) {
      setDecodedToken(null);
      setIsLoading(false);
      return;
    }

    // Skip refresh check if we just set a new token
    if (skipRefreshCheck) {
      const decoded = decodeToken(token);
      setDecodedToken(decoded);
      setIsLoading(false);
      setSkipRefreshCheck(false);
      return;
    }

    const isTokenValid = await checkAndRefreshToken();

    if (isTokenValid) {
      const currentToken = getToken();
      if (currentToken) {
        const decoded = decodeToken(currentToken);
        setDecodedToken(decoded);
      } else {
        setDecodedToken(null);
      }
    } else {
      removeToken();
      setDecodedToken(null);
      // Redirect to signin if we're on a protected route
      const currentPath = globalThis.location.pathname;
      const protectedRoutes = ['/Account', '/FavoriteList'];
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
        router.push('/signin');
      }
    }

    setIsLoading(false);
  }, [checkAndRefreshToken, router, skipRefreshCheck]);

  const logout = useCallback(() => {
    removeToken();
    setDecodedToken(null);
    router.push('/signin');
  }, [router]);

  const updateToken = useCallback((newToken: string) => {
    const decoded = decodeToken(newToken);
    setDecodedToken(decoded);
    setSkipRefreshCheck(true); // Skip next refresh check
    setIsLoading(false);
  }, []);

  // Handle server-side refresh hints
  const handleServerRefreshHint = useCallback(async () => {
    // This can be called from an axios interceptor or fetch wrapper
    // when you detect the X-Token-Refresh-Needed header
    await checkAndRefreshToken();
  }, [checkAndRefreshToken]);

  useEffect(() => {
    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    globalThis.addEventListener('storage', handleStorageChange);

    // Check token expiration every hour instead of refreshing constantly
    const interval = setInterval(() => {
      const token = getToken();
      if (token) {
        // Only check and refresh if not in signup/signin flow
        if (sessionStorage.getItem('skipTokenRefresh') !== 'true') {
          checkAndRefreshToken();
        }
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => {
      globalThis.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [checkAuth, checkAndRefreshToken]);

  return {
    decodedToken,
    isAuthenticated: !!decodedToken?.userId,
    isLoading,
    setDecodedToken,
    logout,
    updateToken,
    checkAuth,
    handleServerRefreshHint
  };
};