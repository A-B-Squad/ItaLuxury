export const event = (name, options = {}, eventID = {}) => {
  window.fbq("track", name, options, eventID);
};
