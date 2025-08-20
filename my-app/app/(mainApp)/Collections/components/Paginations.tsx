

import React, { useEffect, useRef } from "react";
interface ShowMoreProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<ShowMoreProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && currentPage < totalPages) {
          onPageChange(currentPage + 1);
        }
      },
      {
        threshold: 1,
        rootMargin: "0px 0px 100px 0px",
      }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, [currentPage, totalPages, isLoading, onPageChange]);

  if (currentPage >= totalPages) {
    return null;
  }

  return (
    <div className="flex justify-center my-6 opacity-0 animate-fadeIn">
      <button
        ref={buttonRef}
        disabled={isLoading}
        className="relative px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-600 hover:text-white focus:ring-2 focus:ring-blue-500 focus:z-10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        ) : (
          "Voir Plus"
        )}
      </button>
    </div>
  );
};


export default Pagination
