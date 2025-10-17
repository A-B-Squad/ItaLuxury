"use client";

import React, { memo } from 'react';

// Types
interface CategoryState {
  categoryDescription?: string;
  isLoading?: boolean;
}

interface CategoryHeaderProps {
  state: CategoryState;
  searchParams: URLSearchParams;
  className?: string;
}

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 mb-8 animate-pulse hidden md:block">
    <div className="flex items-start gap-4">
      <div className="w-1 h-16 bg-gray-300 rounded-full"></div>
      <div className="flex-1">
        <div className="h-7 bg-gray-300 rounded mb-3 w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

// Format category name
const formatCategoryName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  state, 
  searchParams, 
  className = '' 
}) => {
  const categoryName = searchParams?.get("category");
  
  // Early returns
  if (!categoryName) return null;
  
  if (state?.isLoading) {
    return <LoadingSkeleton />;
  }
  
  if (!state?.categoryDescription) return null;

  return (
    <div className={`bg-gradient-to-r from-white border border-blue-100 rounded-xl p-6 mb-8 hidden md:block ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-1 h-16 bg-primaryColor rounded-full flex-shrink-0" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {formatCategoryName(categoryName)}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {state.categoryDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryHeader);