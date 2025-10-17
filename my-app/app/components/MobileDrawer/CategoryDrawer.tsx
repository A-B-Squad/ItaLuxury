"use client";
import {
    useDrawerMobileCategory
} from "@/app/store/zustand";
import { MAIN_CATEGORY_QUERY } from "@/graphql/queries";

import { useQuery } from "@apollo/client";
import { Drawer, IconButton, Typography } from "@material-tailwind/react";


import MainCategory from "./Category/MainCategory";


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
            className="p-4 h-full z-[999991]"
            size={400}
            overlayProps={{ className: "fixed inset-0 bg-black/50 z-[9998]" }}
            placeholder={""}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            onResize={undefined}
            onResizeCapture={undefined}     >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b">
                    <Typography
                        variant="h5"
                        className="font-medium text-gray-900"
                        placeholder={""}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}                    >
                        Catégories
                    </Typography>

                    <IconButton
                        variant="text"
                        color="gray"
                        onClick={closeCategoryDrawer}
                        className="rounded-full hover:bg-gray-100"
                        placeholder={""}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined} onResize={undefined} onResizeCapture={undefined}                    >
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

                {/* Categories */}
                {
                    data?.fetchMainCategories?.length > 0 ? (
                        <MainCategory
                            fetchMainCategories={data?.fetchMainCategories}

                            closeCategoryDrawer={closeCategoryDrawer}
                        />
                    ) : (
                        <p className="px-7 py-4 text-gray-600">
                            Aucune catégorie disponible pour le moment. Veuillez revenir plus tard !
                        </p>
                    )
                }
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
        </Drawer>
    );
};

export default CategoryDrawer;
