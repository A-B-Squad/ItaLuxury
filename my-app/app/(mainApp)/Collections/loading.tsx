import Image from "next/legacy/image";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center z-[1000] fixed justify-center h-full top-0 w-full bg-white">
      <Image
        priority
        width={600}
        height={200}
        unoptimized
        objectFit="contain"
        src="/Logo-animation.gif"
        alt="Loading animation"
      />
    </div>
  );
};

export default Loading;
