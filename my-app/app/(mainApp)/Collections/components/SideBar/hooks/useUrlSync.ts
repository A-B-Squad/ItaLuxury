
import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export const useUrlSync = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const updateUrl = useCallback((url: string, options: { scroll?: boolean } = {}) => {
    startTransition(() => {
      router.push(url, options);
    });
  }, [router]);

  const replaceUrl = useCallback((url: string, options: { scroll?: boolean } = {}) => {
    startTransition(() => {
      router.replace(url, options);
    });
  }, [router]);

  return { updateUrl, replaceUrl, isPending };
};