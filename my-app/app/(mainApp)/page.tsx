import React from "react";
import Home from "./Home/Home";
import dynamic from "next/dynamic";
const CenterAds = dynamic(
  () => import("../components/adverstissment/centerAds"),
);
const HomePage = () => {
  return (
    <>
      <CenterAds />
      <Home />
    </>
  );
};
export default HomePage;
