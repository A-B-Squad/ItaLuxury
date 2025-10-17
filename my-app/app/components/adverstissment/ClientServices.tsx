"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import { CLIENT_SERVICES } from "@/graphql/queries";

interface Advertisement {
  link: string;
  images: string[];
}

interface QueryResult {
  advertismentByPosition: Advertisement[];
}

const ClientServices: React.FC = () => {
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});

  const { loading: loadingClientService1, data: client1 } = useQuery<QueryResult>(
    CLIENT_SERVICES,
    { variables: { position: "client_service_1" }, fetchPolicy: "cache-first" }
  );

  const { loading: loadingClientService2, data: client2 } = useQuery<QueryResult>(
    CLIENT_SERVICES,
    { variables: { position: "client_service_2" }, fetchPolicy: "cache-first" }
  );

  const { loading: loadingClientService3, data: client3 } = useQuery<QueryResult>(
    CLIENT_SERVICES,
    { variables: { position: "client_service_3" }, fetchPolicy: "cache-first" }
  );

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => ({ ...prev, [index]: true }));
  };

  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center w-full h-52 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
      <div className="w-10 h-10 bg-gray-300 rounded-full mb-2" />
      <p className="text-gray-400 font-medium text-sm">384px × 218px</p>
      <p className="text-gray-400 text-xs mt-1">Image non disponible</p>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center w-full h-52 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-200 shadow-sm animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-full" />
      <p className="text-gray-400 text-sm mt-2">Chargement...</p>
    </div>
  );

  const renderAdvertisement = (data: QueryResult | undefined, index: number) => {
    if (!data?.advertismentByPosition?.[0]) return null;

    const ad = data.advertismentByPosition[0];
    return (
      <Link
        href={ad.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:shadow-xl w-full max-w-[384px] h-[218px]"
      >
        <div className="relative w-full h-full">
          {!imagesLoaded[index] && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <p className="text-gray-400 text-sm mt-2">Chargement...</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-20" />
          <Image
            src={ad.images[0]}
            alt={`Service client ${index}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            priority
            className="transition-transform duration-500 group-hover:scale-105"
            onLoad={() => handleImageLoad(index)}
          />
        </div>
      </Link>
    );
  };

  const clientServices = [
    { loading: loadingClientService1, data: client1, index: 1 },
    { loading: loadingClientService2, data: client2, index: 2 },
    { loading: loadingClientService3, data: client3, index: 3 }
  ];

  return (
    <div className="service_client w-full grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 place-content-center place-items-center">
      {clientServices.map(({ loading, data, index }) => (
        <div key={index} className="w-full max-w-[384px]">
          {loading
            ? renderLoading()
            : !data?.advertismentByPosition?.length
              ? renderPlaceholder()
              : renderAdvertisement(data, index)}
        </div>
      ))}
    </div>
  );
};

export default ClientServices;