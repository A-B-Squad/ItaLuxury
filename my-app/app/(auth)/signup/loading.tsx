import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white">
      <div className="relative w-[600px] h-[200px]">
        <video
          width={600}
          height={200}
          autoPlay
          loop
          muted
          playsInline
          className="object-contain w-full h-full"
        >
          <source src="/images/logos/logo-animation.webm" type="video/webm" />
        </video>
      </div>
    </div>
  );
};

export default Loading;