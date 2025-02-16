// import React from "react";

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange,
// }) => {
//   const maxPagesToShow = 5;

//   const getPageNumbers = () => {
//     const pageNumbers = [];

//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       pageNumbers.push(1);

//       if (currentPage <= 3) {
//         for (let i = 2; i <= 4; i++) {
//           pageNumbers.push(i);
//         }
//         if (totalPages > 5) {
//           pageNumbers.push("...");
//           pageNumbers.push(totalPages);
//         }
//       } else if (currentPage >= totalPages - 2) {
//         if (totalPages > 5) {
//           pageNumbers.push("...");
//         }
//         for (let i = totalPages - 3; i <= totalPages; i++) {
//           pageNumbers.push(i);
//         }
//       } else {
//         pageNumbers.push("...");
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           pageNumbers.push(i);
//         }
//         pageNumbers.push("...");
//         pageNumbers.push(totalPages);
//       }
//     }

//     return pageNumbers;
//   };

//   const handlePageClick = (number: number | string) => {
//     if (typeof number === "number") {
//       onPageChange(number);
//     } else if (number === "..." && currentPage > 3) {
//       // When clicking on the first ellipsis, go to the page after it
//       onPageChange(currentPage - 2);
//     } else if (number === "..." && currentPage <= totalPages - 3) {
//       // When clicking on the last ellipsis, go to the page before it
//       onPageChange(currentPage + 2);
//     }
//   };

//   return (
//     <nav className="flex justify-center items-center my-6">
//       <ul className="inline-flex items-center -space-x-px">
//         <li>
//           <button
//             onClick={() => onPageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`px-3 py-2 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300
//               ${currentPage !== 1
//                 ? "hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600"
//                 : "cursor-not-allowed"
//               }`}
//           >
//             <svg
//               aria-hidden="true"
//               className="w-5 h-5"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                 clipRule="evenodd"
//               ></path>
//             </svg>
//           </button>
//         </li>
//         {getPageNumbers().map((number, index) => (
//           <li key={index}>
//             <button
//               onClick={() => handlePageClick(number)}
//               className={`px-3 py-2 leading-tight border border-gray-300
//                 ${currentPage === number
//                   ? "z-10 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600"
//                   : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600"
//                 }`}
//             >
//               {number}
//             </button>
//           </li>
//         ))}
//         <li>
//           <button
//             onClick={() => onPageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`px-3 py-2 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300
//               ${currentPage !== totalPages
//                 ? "hover:bg-gray-100 hover:text-gray-700 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-600"
//                 : "cursor-not-allowed"
//               }`}
//           >
//             <svg
//               aria-hidden="true"
//               className="w-5 h-5"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                 clipRule="evenodd"
//               ></path>
//             </svg>
//           </button>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Pagination;


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
