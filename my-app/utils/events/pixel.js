

// Track events with eventID for deduplication
export function event(name, options = {}, eventID) {
  try {
    if (typeof window === 'undefined') return;
    if (globalThis.fbq) {
      if (eventID) {
        globalThis.fbq('track', name, options, { eventID });
        console.log(`✅ [Pixel] ${name} tracked (ID: ${eventID})`);
      } else {
        globalThis.fbq('track', name, options);
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
