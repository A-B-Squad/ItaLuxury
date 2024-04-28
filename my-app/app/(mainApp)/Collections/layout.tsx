import SideBar from "./_components/sideBar";
import TopBar from "./_components/topBar";
import React, { ReactNode} from "react";
type Props = {
  children: ReactNode;
};
const layout = (props: Props) => {
  return (
    <div className="relative flex w-full flex-col">
      <TopBar />
        <div className="w-full flex">
          <SideBar />

          <main style={{width:"inherit"}} className=" relative">{props.children}</main>
        </div>
    </div>
  );
};

export default layout;
