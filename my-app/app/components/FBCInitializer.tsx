'use client';

import { useEffect } from 'react';
import { initializeFbcTracking } from '@/utlils/events/pixel';

export default function FBCInitializer() {
  useEffect(() => {
    // Initialize FBC tracking on component mount
    initializeFbcTracking();
    
    // Log status in development
    if (process.env.NODE_ENV === 'development') {
      const { getFbcStatus } = require('@/utlils/events/pixel');
      const status = getFbcStatus();
      console.log('[FBC Init] Status:', status);
    }
  }, []);

  return null; 
}