// fbq.js

export function event(name, options = {}, eventID = string) {
  try {
    if (window.fbq) {
      if (eventID) {
        window.fbq('track', name, options, { eventID });
      } else {
        window.fbq('track', name, options);
      }
      console.log(`[Meta Pixel] Event tracked: ${name}`, options);
    } else {
      console.warn(`[Meta Pixel] fbq is not defined. Event ${name} may not be tracked.`);
    }
  } catch (error) {
    console.error(`[Meta Pixel] Error in event tracking for ${name}:`, error);
  }
}

export function getFbp() {
  try {
    return (
      document.cookie.split('; ').find(row => row.startsWith('_fbp='))?.split('=')[1] || null
    );
  } catch (error) {
    console.error('[Meta Pixel] Error getting _fbp cookie:', error);
    return null;
  }
}

export function getFbc() {
  try {
    return (
      document.cookie.split('; ').find(row => row.startsWith('_fbc='))?.split('=')[1] || null
    );
  } catch (error) {
    console.error('[Meta Pixel] Error getting _fbc cookie:', error);
    return null;
  }
}

export function pageview() {
  try {
    if (window.fbq) {
      window.fbq('track', 'PageView');
      console.log('[Meta Pixel] PageView event tracked');
    } else {
      console.warn('[Meta Pixel] fbq is not defined. PageView may not be tracked.');
    }
  } catch (error) {
    console.error('[Meta Pixel] Error tracking PageView:', error);
  }
}

