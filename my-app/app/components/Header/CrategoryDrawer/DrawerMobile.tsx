"use client";
import { gql, useQuery } from "@apollo/client";
import { Drawer, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDrawerMobileStore } from "../../../store/zustand";
import Category from "./MainCategory";

interface Subcategory {
  name: string;
  subcategories?: Subcategory[];
}

const CATEGORY_QUERY = gql`
  query Categories {
    categories {
      id
      name
      subcategories {
        name
        parentId
        subcategories {
          name
          parentId
        }
      }
    }
  }
`;
export function DrawerMobile() {
  const { isOpen, closeCategoryDrawer } = useDrawerMobileStore();
  const { loading, error, data } = useQuery(CATEGORY_QUERY);
  const [activeCategory, setActiveCategory] = useState<string>("");

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <Drawer
        placeholder={""}
        open={isOpen}
        onClose={closeCategoryDrawer}
        placement="left"
        size={350}
        className=" md:hidden   overflow-y-auto"
      >
        <div className=" px-2 py-3 flex items-center justify-center text-white bg-strongBeige  ">
          <Link
            href="/signin"
            className="font-bold text-xl  flex items-center gap-2 "
          >
            <FaUser />
            Bonjour, Identifiez-vous
          </Link>
          <IconButton
            placeholder={""}
            variant="text"
            color="blue-gray"
            onClick={closeCategoryDrawer}
            className="ml-auto"
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
        <Category
          data={data}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </Drawer>
    </>
  );
}
