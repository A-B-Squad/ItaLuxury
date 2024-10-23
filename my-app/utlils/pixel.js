// fbq.js
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export function pageview() {
  window.fbq('track', 'PageView');
}

export function event(name, options = {}, eventID = {}) {
  window.fbq('track', name, options, eventID);
}

export function getFbp() {
  return (
    document.cookie.split('; ').find(row => row.startsWith('_fbp='))
    ?.split('=')[1] || null
  );
}

export function getFbc() {
  return (
    document.cookie.split('; ').find(row => row.startsWith('_fbc='))
    ?.split('=')[1] || null
  );
}

export function init() {
  if (typeof window !== 'undefined') {
    window.fbq = window.fbq || function() {
      window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = window.fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];
    window.fbq('init', FB_PIXEL_ID);
    pageview();
  }
}