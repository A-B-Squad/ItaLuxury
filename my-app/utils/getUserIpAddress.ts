export const getUserIpAddress = async () => {
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    return data.ip || "0.0.0.0";
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null; 
  }
};
