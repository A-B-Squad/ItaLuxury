"use client";
import React from "react";
import { useComparedProductsStore } from "@/app/store/zustand";

const ProductComparison = () => {
  const { products } = useComparedProductsStore();

 console.log('====================================');
 console.log(products);
 console.log('====================================');

  return (
    <div className="relative overflow-x-auto p-8">
      <h1 className="font-bold text-2xl">Compare Produits (2)</h1>
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-xs text-gray-700 uppercase  ">
          <tr>
            <th scope="col" className="px-2 py-1">
              <div className="relative m-2 flex w-[40rem] max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                <a
                  className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
                  href="#"
                >
                  <img
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt="product image"
                  />
                </a>
                <div className="mt-4 px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl tracking-tight text-slate-900">
                      Nike Air MX Super 2500 - Red
                    </h5>
                  </a>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                      <span className="text-3xl font-bold text-slate-900">
                        $449
                      </span>
                      <span className="text-sm text-slate-900 line-through">
                        $699
                      </span>
                    </p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-md bg-strongBeige px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to cart
                  </a>
                </div>
              </div>
            </th>
            <th scope="col" className="px-2 py-1">
              <div className="relative m-2 flex w-[40rem] max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                <a
                  className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
                  href="#"
                >
                  <img
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt="product image"
                  />
                </a>
                <div className="mt-4 px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl tracking-tight text-slate-900">
                      Nike Air MX Super 2500 - Red
                    </h5>
                  </a>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                      <span className="text-3xl font-bold text-slate-900">
                        $449
                      </span>
                      <span className="text-sm text-slate-900 line-through">
                        $699
                      </span>
                    </p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-md bg-strongBeige px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to cart
                  </a>
                </div>
              </div>
            </th>
            <th scope="col" className="px-2 py-1">
              <div className="relative m-2 flex w-[40rem] max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
                <a
                  className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
                  href="#"
                >
                  <img
                    className="object-cover"
                    src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                    alt="product image"
                  />
                </a>
                <div className="mt-4 px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl tracking-tight text-slate-900">
                      Nike Air MX Super 2500 - Red
                    </h5>
                  </a>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                      <span className="text-3xl font-bold text-slate-900">
                        $449
                      </span>
                      <span className="text-sm text-slate-900 line-through">
                        $699
                      </span>
                    </p>
                  </div>
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-md bg-strongBeige px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Add to cart
                  </a>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-200 border-b">
            <th
              scope="row"
              className="px-6 py-4  font-bold text-gray-900 whitespace-nowrap "
            >
              Prix
            </th>
            <td className="px-6 py-4">240 DT</td>
            <td className="px-6 py-4">120 DT</td>
            <td className="px-6 py-4">120 DT</td>
          </tr>
          <tr className="bg-white border-b ">
            <th
              scope="row"
              className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap"
            >
              Description
            </th>
            <td className="px-6 py-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque
              asperiores cumque sit commodi, mollitia adipisci facilis culpa
              nesciunt nemo beatae sapiente ipsam in nisi, dolorum quibusdam
              repellat illum maiores sunt?
            </td>
            <td className="px-6 py-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque
              asperiores cumque sit commodi, mollitia adipisci facilis culpa
              nesciunt nemo beatae sapiente ipsam in nisi, dolorum quibusdam
              repellat illum maiores sunt?
            </td>
            <td className="px-6 py-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque
              asperiores cumque sit commodi, mollitia adipisci facilis culpa
              nesciunt nemo beatae sapiente ipsam in nisi, dolorum quibusdam
              repellat illum maiores sunt?
            </td>
          </tr>
          <tr className="bg-gray-200">
            <th
              scope="row"
              className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap "
            >
              Matiére
            </th>
            <td className="px-6 py-4">Cuire</td>
            <td className="px-6 py-4">Boi</td>
            <td className="px-6 py-4">Boi</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparison;
