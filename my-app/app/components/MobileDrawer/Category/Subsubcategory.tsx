import Image from "next/image";
import React, { memo } from "react";
import { IoArrowBack } from "react-icons/io5";

interface SubsubcategoryType {
  id: string;
  name: string;
  smallImage: string;
}

interface SubsubcategoryProps {
  subsubcategories: SubsubcategoryType[];
  parentSubcategoryName: string;
  backToSubcategory: () => void;
  closeCategoryDrawer: () => void;
}

const Subsubcategory: React.FC<SubsubcategoryProps> = ({
  subsubcategories,
  parentSubcategoryName,
  backToSubcategory,
  closeCategoryDrawer,
}) => {
  if (!subsubcategories?.length) {
    return (
      <div className="absolute inset-0 flex flex-col bg-white translate-x-full animate-slide-in">
        <h2 className="text-lg font-medium uppercase px-7 pt-4 mb-2">
          Sous-sous-catégories :
        </h2>
        <button
          onClick={backToSubcategory}
          className="flex items-center gap-3 px-7 py-3 font-bold uppercase hover:bg-gray-50 w-full border-b-2"
        >
          <IoArrowBack size={22} />
          Retour
        </button>
        <p className="py-5 px-7 text-gray-500">
          Aucune sous-sous-catégorie disponible.
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-white  transition-transform duration-300 transform translate-x-0">
      <h2 className="text-lg font-medium uppercase px-7 pt-4 mb-2">
        Choisir une sous-sous-catégorie :
      </h2>

      {/* Back button */}
      <button
        onClick={backToSubcategory}
        className="flex items-center gap-3 px-7 py-3 font-bold uppercase hover:bg-gray-50 w-full transition-all border-b-2"
      >
        <IoArrowBack size={22} />
        Retour
      </button>

      <div className="mt-2">
        {subsubcategories.map((subsub) => (
          <div
            key={subsub.id}
            onClick={() => {
              closeCategoryDrawer();
              window.location.href = `/Collections/tunisie?${new URLSearchParams({
                category: subsub.name,
              })}`;
            }}
            className="flex items-center px-7 py-3 border-b cursor-pointer hover:bg-gray-50"
          >

            <div className="flex items-center gap-1">
              <Image loading="lazy" src={subsub?.smallImage} alt="image subsubcategory" width={40} height={40} />
              <span className="capitalize text-gray-700">{subsub.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Subsubcategory);