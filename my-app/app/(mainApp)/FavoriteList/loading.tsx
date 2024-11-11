import Image from "next/legacy/image";
import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white">
      <div className="relative w-[600px] h-[200px]">
        <Image
          priority
          unoptimized
          width={600}
          height={200}
          objectFit="contain"
          src="/Logo-animation.gif"
          alt="Loading animation"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default Loading;
