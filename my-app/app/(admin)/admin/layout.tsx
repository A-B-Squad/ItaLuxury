import React from "react";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex w-full flex-col">
      <Header />
      <div className="w-full flex">
        <div className="w-[20%]"> {/* Set SideBar width to 1/4 of the container */}
          <SideBar />
        </div>
        <main className="w-[80%] flex justify-center items-center"> {/* Center content */}
          {children}
        </main>
      </div>
    </div>
  );
}
