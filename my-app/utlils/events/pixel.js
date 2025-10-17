// my-app/utlils/events/pixel.js

// ==================== HELPER FUNCTIONS ====================

// Get cookie value by name
function getCookie(name) {
  try {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  } catch (error) {
    console.error(`[Meta Pixel] Error getting ${name} cookie:`, error);
    return null;
  }
}

// Set cookie with expiration
function setCookie(name, value, days) {
  try {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  } catch (error) {
    console.error(`[Meta Pixel] Error setting ${name} cookie:`, error);
  }
}

// Check if FBC is expired (older than 90 days)
function isFbcExpired(fbc) {
  try {
    // FBC format: fb.1.timestamp.fbclid
    const parts = fbc.split('.');
    if (parts.length !== 4 || parts[0] !== 'fb') return true;
    
    const timestamp = parseInt(parts[2], 10);
    if (isNaN(timestamp)) return true;
    
    const now = Math.floor(Date.now() / 1000);
    const ninetyDaysInSeconds = 90 * 24 * 60 * 60; // 90 days
    
    const isExpired = (now - timestamp) > ninetyDaysInSeconds;
    
    if (isExpired) {
      const daysOld = Math.floor((now - timestamp) / (24 * 60 * 60));
      console.warn(`[Meta Pixel] FBC is expired (${daysOld} days old). Max age is 90 days.`);
    }
    
    return isExpired;
  } catch (error) {
    console.error('[Meta Pixel] Error checking FBC expiration:', error);
    return true;
  }
}

// Get fbclid from URL parameters
function getFbclidFromUrl() {
  try {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('fbclid');
  } catch (error) {
    console.error('[Meta Pixel] Error getting fbclid from URL:', error);
    return null;
  }
}

// Generate FBC from fbclid
function generateFbc(fbclid) {
  const timestamp = Math.floor(Date.now() / 1000);
  const subdomainIndex = 1;
  return `fb.${subdomainIndex}.${timestamp}.${fbclid}`;
}

// ==================== EXPORTED FUNCTIONS ====================

// Track events with eventID for deduplication
export function event(name, options = {}, eventID) {
  try {
    if (window.fbq) {
      if (eventID) {
        window.fbq('track', name, options, { eventID });
        console.log(`[Meta Pixel] Event tracked: ${name} (eventID: ${eventID})`, options);
      } else {
        window.fbq('track', name, options);
        console.log(`[Meta Pixel] Event tracked: ${name}`, options);
      }
    } else {
      console.warn(`[Meta Pixel] fbq is not defined. Event ${name} may not be tracked.`);
    }
  } catch (error) {
    console.error(`[Meta Pixel] Error in event tracking for ${name}:`, error);
  }
}

// Get FBP (Facebook Browser ID)
export function getFbp() {
  try {
    const fbp = getCookie('_fbp');
    if (fbp) {
      console.log('[Meta Pixel] FBP retrieved:', fbp);
    }
    return fbp;
  } catch (error) {
    console.error('[Meta Pixel] Error getting _fbp cookie:', error);
    return null;
  }
}

// Get or refresh FBC parameter with expiration check - THIS IS THE KEY FIX
export function getFbc() {
  try {
    // STEP 1: Check if there's a fresh fbclid in the URL
    const fbclidFromUrl = getFbclidFromUrl();
    
    if (fbclidFromUrl) {
      // Generate fresh FBC from URL fbclid
      const freshFbc = generateFbc(fbclidFromUrl);
      // Store it in cookie for future use (90 days)
      setCookie('_fbc', freshFbc, 90);
      console.log('[Meta Pixel] Fresh FBC generated from URL:', freshFbc);
      return freshFbc;
    }
    
    // STEP 2: Try to get existing FBC from cookie
    const existingFbc = getCookie('_fbc');
    
    if (existingFbc) {
      // Check if it's expired
      if (isFbcExpired(existingFbc)) {
        console.warn('[Meta Pixel] FBC parameter is expired (>90 days). Clearing stale value.');
        // Clear the expired cookie
        setCookie('_fbc', '', -1);
        return null; // Return null instead of expired value - THIS FIXES THE ERROR
      }
      console.log('[Meta Pixel] Valid FBC retrieved:', existingFbc);
      return existingFbc;
    }
    
    console.log('[Meta Pixel] No FBC found');
    return null;
  } catch (error) {
    console.error('[Meta Pixel] Error getting _fbc cookie:', error);
    return null;
  }
}


// Initialize FBC tracking on page load
export function initializeFbcTracking() {
  try {
    if (typeof window === 'undefined') return;
    
    // Check for fbclid on page load
    const fbclidFromUrl = getFbclidFromUrl();
    if (fbclidFromUrl) {
      const freshFbc = generateFbc(fbclidFromUrl);
      console.log('[Meta Pixel] Fresh FBC generated from URL:aaaaaaaaaa', freshFbc);
      setCookie('_fbc', freshFbc, 90);
      console.log('[Meta Pixel] Fresh FBC generated and stored on init:', freshFbc);
    } else {
      // Validate existing FBC
      const existingFbc = getCookie('_fbc');
      if (existingFbc && isFbcExpired(existingFbc)) {
        console.warn('[Meta Pixel] Clearing expired FBC on initialization');
        setCookie('_fbc', '', -1);
      }
    }
  } catch (error) {
    console.error('[Meta Pixel] Error initializing FBC tracking:', error);
  }
}



// Get FBC status for debugging
export function getFbcStatus() {
  try {
    const fbc = getCookie('_fbc');
    if (!fbc) {
      return { exists: false, expired: null, age: null };
    }
    
    const parts = fbc.split('.');
    if (parts.length !== 4) {
      return { exists: true, expired: true, age: null, invalid: true };
    }
    
    const timestamp = parseInt(parts[2], 10);
    const now = Math.floor(Date.now() / 1000);
    const ageInDays = Math.floor((now - timestamp) / (24 * 60 * 60));
    const expired = isFbcExpired(fbc);
    
    return {
      exists: true,
      expired,
      ageInDays,
      value: fbc,
    };
  } catch (error) {
    console.error('[Meta Pixel] Error getting FBC status:', error);
    return { error: true };
  }
}