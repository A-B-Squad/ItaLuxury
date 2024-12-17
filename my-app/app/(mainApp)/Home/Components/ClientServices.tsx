"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/legacy/image";
import { CLIENT_SERVICES } from "@/graphql/queries";

interface Advertisement {
  link: string;
  images: string[];
}

interface QueryResult {
  advertismentByPosition: Advertisement[];
}

const ClientServices: React.FC = () => {
  const { loading: loadingClientService1, data: client1 } = useQuery<QueryResult>(
    CLIENT_SERVICES,
    { variables: { position: "client_service_1" } }
  );

  const { loading: loadingClientService2, data: client2 } = useQuery<QueryResult>(
    CLIENT_SERVICES,
    { variables: { position: "client_service_2" } }
  );

  const { loading: loadingClientService3, data: client3 } = useQuery<QueryResult>(
    CLIENT_SERVICES,
    { variables: { position: "client_service_3" } }
  );

  // Placeholder component with rounded design
  const renderPlaceholder = () => (
    <div className="
      flex items-center justify-center 
      w-full h-52 
      rounded-md 
      bg-gray-100 
      border border-gray-200
      shadow-sm
    ">
      <p className="text-gray-500 font-medium">384px × 218px</p>
    </div>
  );

  // Loading state with rounded design
  const renderLoading = () => (
    <div className="
      grid animate-pulse 
      w-full h-52 
      place-items-center 
      rounded-md 
      bg-gray-100 
      border border-gray-200
      shadow-sm
    ">
      <IoImageOutline className="h-12 w-12 text-gray-400" />
    </div>
  );

  // Advertisement rendering with enhanced rounded design
  const renderAdvertisement = (
    data: QueryResult | undefined, 
    index: number
  ) => {
    if (!data?.advertismentByPosition?.[0]) return null;

    const ad = data.advertismentByPosition[0];
    return (
      <Link
        href={ad.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="
          block 
          rounded-md 
          overflow-hidden 
          shadow-lg 
          border border-gray-200 
          transition-all 
          duration-300 
          hover:shadow-xl 
          w-[300px] 
          h-[150px] 
          lg:w-[384px] 
          lg:h-[218px]
        "
      >
        <div className="relative w-full h-full">
          <Image
            src={ad.images[0]}
            alt={`Client service  ${index}`}
            layout="fill"
            objectFit="cover"
            priority
            className="
              cursor-pointer 
              transition-opacity 
              duration-300 
              hover:opacity-80
            "
          />
        </div>
      </Link>
    );
  };

  return (
    <div className="
      service_client 
      grid 
      py-10 
      grid-cols-1 
      gap-6 
      md:grid-cols-2 
      xl:grid-cols-3 
      place-content-center 
      place-items-center
    ">
      {/* Client Service 1 */}
      {loadingClientService1
        ? renderLoading()
        : !client1?.advertismentByPosition?.length
          ? renderPlaceholder()
          : renderAdvertisement(client1, 1)}

      {/* Client Service 2 */}
      {loadingClientService2
        ? renderLoading()
        : !client2?.advertismentByPosition?.length
          ? renderPlaceholder()
          : renderAdvertisement(client2, 2)}

      {/* Client Service 3 */}
      {loadingClientService3
        ? renderLoading()
        : !client3?.advertismentByPosition?.length
          ? renderPlaceholder()
          : renderAdvertisement(client3, 3)}
    </div>
  );
};

export default ClientServices;