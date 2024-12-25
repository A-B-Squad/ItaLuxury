// fbq.js

export function event(name, options = {}, eventID = {}) {
  try {
    if (window.fbq) {
      window.fbq('track', name, options, eventID);
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


// export function loadFbPixel() {
//   if (typeof window === 'undefined') return;

//   if (!window.fbq) {
//     // Load the Pixel script dynamically
//     const script = document.createElement('script');
//     script.async = true;
//     script.src = 'https://connect.facebook.net/en_US/fbevents.js';
//     document.head.appendChild(script);

//     // Initialize fbq
//     window.fbq = function () {
//       (window.fbq.q = window.fbq.q || []).push(arguments);
//     };
//     window.fbq.loaded = true;
//   }
// }



// export function init(FB_PIXEL_ID) {
//   if (typeof window === 'undefined') return;

//   if (FB_PIXEL_ID) {
//     loadFbPixel();

//     window.fbq = window.fbq || function () {
//       (window.fbq.q = window.fbq.q || []).push(arguments);
//     };

//     window.fbq('init', FB_PIXEL_ID);
//     pageview();
//   } else {
//     console.error('[Meta Pixel] Pixel ID is required for initialization.');
//   }
// }