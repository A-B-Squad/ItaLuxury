
import React, { memo } from 'react';
import Link from 'next/link';
import { Category } from '../../types';
import { buildCategoryUrl } from '../../utils/queryHelpers';

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export const CategoryItem = memo<CategoryItemProps>(({ category, isSelected, onClick }) => (
  <li
    className={`${isSelected ? "font-bold" : ""
      } hover:text-black hover:font-bold relative cursor-pointer h-full w-full group transition-all flex items-center justify-between py-2`}
  >
    <Link
      href={buildCategoryUrl(category.name)}
      className="w-full h-full"
      onClick={() => onClick(category.id)}
    >
      {category.name}
    </Link>
    <span
      className={`${isSelected ? "bg-primaryColor" : "bg-secondaryColor"
        } h-full w-[5px] absolute right-0 group-hover:bg-primaryColor rounded-lg border transition-all`}
    />
  </li>
));

CategoryItem.displayName = 'CategoryItem';