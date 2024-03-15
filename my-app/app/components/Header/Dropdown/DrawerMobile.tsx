"use client";
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";

export function DrawerMobile({
  openMobileCategoryDrawer,
  closeMobileDrawerCategory,
}) {
  return (
    <>
      <Drawer
        placeholder={""}
        open={openMobileCategoryDrawer}
        onClose={closeMobileDrawerCategory}
        className="p-4 md:hidden w-4/6"
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography placeholder={""} variant="h5" color="blue-gray">
            Choisir une catégorie
          </Typography>
          <IconButton
            placeholder={""}
            variant="text"
            color="blue-gray"
            onClick={closeMobileDrawerCategory}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>

        <Typography
          placeholder={""}
          color="gray"
          className="mb-8 pr-4 font-normal"
        >
          Material Tailwind features multiple React and HTML components, all
          written with Tailwind CSS classes and Material Design guidelines.
        </Typography>
        <div className="flex gap-2">
          <Button placeholder={""} size="sm" color="blue">
            Documentation
          </Button>
          <Button placeholder={""} size="sm" color="blue">
            Get Started
          </Button>
        </div>
      </Drawer>
    </>
  );
}
