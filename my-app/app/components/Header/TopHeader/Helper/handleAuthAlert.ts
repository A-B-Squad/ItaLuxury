const handleAuthAlert = (decodedToken: any, message: string) => {
    if (!decodedToken || !decodedToken.userId) {
        alert(message);
    }
};
export default handleAuthAlert
