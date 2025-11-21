
// // Get cookie value by name
// function getCookie(name) {
//   try {
//     if (typeof document === 'undefined') return null;
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return parts.pop()?.split(';').shift() || null;
//     }
//     return null;
//   } catch (error) {
//     console.error(`[Meta Pixel] Error getting ${name} cookie:`, error);
//     return null;
//   }
// }

// // Set cookie with expiration
// function setCookie(name, value, days) {
//   try {
//     if (typeof document === 'undefined') return;
//     const expires = new Date();
//     expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
//     const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? ';Secure' : '';
//     document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${secure}`;
//   } catch (error) {
//     console.error(`[Meta Pixel] Error setting ${name} cookie:`, error);
//   }
// }

// // Check if FBC is expired (older than 90 days)
// function isFbcExpired(fbc) {
//   try {
//     const parts = fbc.split('.');
//     if (parts.length !== 4 || parts[0] !== 'fb') return true;
//     const timestamp = parseInt(parts[2], 10);
//     if (isNaN(timestamp)) return true;
//     const now = Math.floor(Date.now() / 1000);
//     const ninetyDaysInSeconds = 90 * 24 * 60 * 60;
//     return (now - timestamp) > ninetyDaysInSeconds;
//   } catch (error) {
//     return true;
//   }
// }

// // Get fbclid from URL parameters
// function getFbclidFromUrl() {
//   try {
//     if (typeof window === 'undefined') return null;
//     const urlParams = new URLSearchParams(window.location.search);
//     return urlParams.get('fbclid');
//   } catch (error) {
//     return null;
//   }
// }

// // Generate FBC from fbclid
// function generateFbc(fbclid) {
//   const timestamp = Math.floor(Date.now() / 1000);
//   const subdomainIndex = 1;
//   return `fb.${subdomainIndex}.${timestamp}.${fbclid}`;
// }

// Track events with eventID for deduplication
export function event(name, options = {}, eventID) {
  try {
    if (typeof window === 'undefined') return;
    if (window.fbq) {
      if (eventID) {
        window.fbq('track', name, options, { eventID });
        console.log(`✅ [Pixel] ${name} tracked (ID: ${eventID})`);
      } else {
        window.fbq('track', name, options);
        console.log(`✅ [Pixel] ${name} tracked`);
      }
    }
  } catch (error) {
    console.error(`❌ [Pixel] Error tracking ${name}:`, error);
  }
}

// Get FBP (Facebook Browser ID)
export function getFbp() {
  try {
    return getCookie('_fbp');
  } catch (error) {
    return null;
  }
}

// Get or refresh FBC parameter
export function getFbc() {
  try {
    const fbclidFromUrl = getFbclidFromUrl();
    if (fbclidFromUrl) {
      const freshFbc = generateFbc(fbclidFromUrl);
      setCookie('_fbc', freshFbc, 90);
      return freshFbc;
    }
    const existingFbc = getCookie('_fbc');
    if (existingFbc) {
      if (isFbcExpired(existingFbc)) {
        setCookie('_fbc', '', -1);
        return null;
      }
      return existingFbc;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Initialize FBC tracking
// export function initializeFbcTracking() {
//   try {
//     if (typeof window === 'undefined') return;
//     const fbclidFromUrl = getFbclidFromUrl();
//     if (fbclidFromUrl) {
//       const freshFbc = generateFbc(fbclidFromUrl);
//       setCookie('_fbc', freshFbc, 90);
//       console.log('✅ [Pixel] FBC initialized from URL');
//     } else {
//       const existingFbc = getCookie('_fbc');
//       if (existingFbc && isFbcExpired(existingFbc)) {
//         setCookie('_fbc', '', -1);
//       }
//     }
//   } catch (error) {
//     console.error('❌ [Pixel] Error initializing FBC:', error);
//   }
// }