import React from "react";

const TopBar = () => {
  return (
    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        New Arrivals
      </h1>

      <div className="flex items-center">
        <div className="relative inline-block text-left">
          <select name="sort" id="sort" className="max-w-16">
            <option value="">Sort</option>
            <option value="asc">Price : High to Low</option>
            <option value="desc">Price : Low To High</option>
          </select>
        </div>

        <button
          type="button"
          className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
        >
          <span className="sr-only">View grid</span>
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          type="button"
          className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
        >
          <span className="sr-only">Filters</span>
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
