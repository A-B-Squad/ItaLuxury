"use client";
import {
    useDrawerMobileCategory
} from "@/app/store/zustand";
import { MAIN_CATEGORY_QUERY } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";
import MainCategory from "./MainCategory";

const CategoryDrawer = ({ userData }: any) => {
    const { data } = useQuery(MAIN_CATEGORY_QUERY, {
        fetchPolicy: 'cache-first'
    });
    const { isOpen, closeCategoryDrawer } = useDrawerMobileCategory();

    return (
        <Drawer
            placement="right"
            open={isOpen}
            onClose={closeCategoryDrawer}
            overlay={true}
            className="p-0 h-full z-[999991] bg-white"
            size={400}
            overlayProps={{ className: "fixed inset-0 bg-black/50 z-[9998]" }}
            placeholder={""}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
                    <Typography
                        variant="h5"
                        className="font-heading font-bold text-gray-900 text-xl"
                        placeholder={""}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                        onResize={undefined}
                        onResizeCapture={undefined}
                    >
                        Catégories
                    </Typography>

                    <button
                        onClick={closeCategoryDrawer}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <IoClose size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Categories Content */}
                <div className="flex-1 overflow-y-auto ">
                    {
                        data?.fetchMainCategories?.length > 0 ? (
                            <MainCategory
                                fetchMainCategories={data?.fetchMainCategories}
                                closeCategoryDrawer={closeCategoryDrawer}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                                <svg
                                    className="w-16 h-16 text-gray-300 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                                <p className="text-gray-600 text-sm">
                                    Aucune catégorie disponible pour le moment.
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    Veuillez revenir plus tard !
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </Drawer>
    );
};

export default CategoryDrawer;