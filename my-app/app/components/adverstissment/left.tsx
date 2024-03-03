import React from "react";

const Left = () => {
  return (
    <div className="left flex md:flex-col flex-row gap-5 md:gap-12">
      <img
        src="https://wamia-media.s3.eu-west-1.amazonaws.com/wysiwyg/wamia-ramadan/B1.jpg"
        alt="image 1"
        className="rounded-xl w-[10rem] md:w-[22rem]"
      />
      <img
        src="https://wamia-media.s3.eu-west-1.amazonaws.com/wysiwyg/wamia-ramadan/B2_Ramadan.gif"
        alt="image 2"
        className="rounded-xl w-[10rem] md:w-[22rem]"
      />
    </div>
  );
};

export default Left;
