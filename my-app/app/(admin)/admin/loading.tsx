import React from "react";
import "../../globals.css";

const Loading = () => {
  return (
    <div className="adminLoader">
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__bar"></div>
      <div className="loader__ball"></div>
    </div>
  );
};

export default Loading;
