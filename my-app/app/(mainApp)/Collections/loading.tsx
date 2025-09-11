import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
    <div className="w-16 h-16 relative">
      <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
      <div className="absolute inset-0 border-t-2 border-primaryColor rounded-full animate-spin"></div>
    </div>
    <p className="mt-6 text-gray-700 font-light tracking-wider">CHARGEMENT</p>
  </div>
  );
};

export default Loading;
