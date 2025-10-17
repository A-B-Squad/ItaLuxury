
import React, { memo } from 'react';
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { IoIosClose } from "react-icons/io";
import { FILTER_SECTIONS } from '../utils/constants';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileDrawer = memo<MobileDrawerProps>(({
  isOpen,
  onClose,
  children
}) => (
  <Drawer
    placeholder={""}
    open={isOpen}
    onClose={onClose}
    size={300}
    className="p-4 flex top-0 flex-col h-full pb-28 pt-10 z-[9999]"
    overlayProps={{ className: "bg-black/50" }}
    onPointerEnterCapture={undefined}
    onPointerLeaveCapture={undefined}
    onResize={undefined}
    onResizeCapture={undefined}

  >
    <div className="mb-6 flex items-center justify-between">
      <Typography
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        variant="h5"
        color="blue-gray"
      >
        {FILTER_SECTIONS.FILTER_TITLE}
      </Typography>
      <IconButton
        variant="text"
        color="blue-gray"
        onClick={onClose}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        onResize={undefined}
        onResizeCapture={undefined} >
        <IoIosClose size={24} />
      </IconButton>
    </div>
    <div className="pb-16 flex-grow overflow-y-auto">
      <form className="relative" aria-label="Product filters mobile">
        {children}
      </form>
    </div>
  </Drawer>
));

MobileDrawer.displayName = 'MobileDrawer';