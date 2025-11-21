import Image from "next/image";
import React, { memo } from "react";

interface SubsubcategoryType {
  id: string;
  name: string;
  smallImage: string;
  parentId: string;
}

interface SubsubcategoryProps {
  subsubcategories: SubsubcategoryType[];
  closeCategoryDrawer: () => void;
}

const Subsubcategory: React.FC<SubsubcategoryProps> = ({
  subsubcategories,
  closeCategoryDrawer,
}) => {
  if (!subsubcategories?.length) {
    return null;
  }

  return (
    <div className="pl-6 bg-gray-50">
      {subsubcategories.map((subsub) => (
        <div
          key={subsub.id}
          onClick={() => {
            closeCategoryDrawer();
            window.location.href = `/Collections/tunisie?${new URLSearchParams({
              category: subsub.name,
            })}`;
          }}
          className="flex items-center px-6 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                loading="lazy"
                src={subsub?.smallImage}
                alt={subsub.name}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
            <span className="capitalize text-gray-700 text-sm group-hover:text-gray-900">
              {subsub.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(Subsubcategory);