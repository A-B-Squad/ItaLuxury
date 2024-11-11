"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/legacy/image";
import { CLIENT_SERVICES } from "@/graphql/queries";

const ClientServices = () => {
  const { loading: loadingClientService1, data: client1 } = useQuery(
    CLIENT_SERVICES,
    {
      variables: { position: "client_service_1" },
    }
  );
  const { loading: loadingClientService2, data: client2 } = useQuery(
    CLIENT_SERVICES,
    {
      variables: { position: "client_service_2" },
    }
  );
  const { loading: loadingClientService3, data: client3 } = useQuery(
    CLIENT_SERVICES,
    {
      variables: { position: "client_service_3" },
    }
  );

  // Helper function to render placeholder
  const renderPlaceholder = () => (
    <div className="flex items-center justify-center w-full h-52 rounded-lg bg-secondaryColor">
      <p>384px x 218px</p>
    </div>
  );

  // Helper function to render loading state
  const renderLoading = () => (
    <div className="grid animate-pulse w-full h-52 place-items-center rounded-lg bg-secondaryColor">
      <IoImageOutline className="h-12 w-12 text-gray-500" />
    </div>
  );

  // Helper function to render advertisement
  const renderAdvertisement = (
    data: { advertismentByPosition: any[] },
    index: number
  ) => {
    if (!data?.advertismentByPosition?.[0]) return null;

    const ad = data.advertismentByPosition[0];
    return (
      <Link
        rel="preload"
        href={ad.link}
        className="shadow-lg border-2 w-[300px] h-[150px] lg:w-[384px] lg:h-[218px]"
      >
        <Image
          src={ad.images[0]}
          alt={`image ${index}`}
          layout="responsive"
          width={384}
          height={218}
          property="true"
          className="cursor-pointer hover:opacity-50 transition-all"
        />
      </Link>
    );
  };

  return (
    <div className="service_client grid gap-10 py-10 grid-cols-1 rounded-sm md:grid-cols-2 xl:grid-cols-3 place-content-center place-items-center">
      {/* Client Service 1 */}
      {loadingClientService1
        ? renderLoading()
        : !client1?.data?.advertismentByPosition?.length
          ? renderPlaceholder()
          : renderAdvertisement(client1.data, 1)}

      {/* Client Service 2 */}
      {loadingClientService2
        ? renderLoading()
        : !client2?.data?.advertismentByPosition?.length
          ? renderPlaceholder()
          : renderAdvertisement(client2.data, 2)}

      {/* Client Service 3 */}
      {loadingClientService3
        ? renderLoading()
        : !client3?.data?.advertismentByPosition?.length
          ? renderPlaceholder()
          : renderAdvertisement(client3.data, 3)}
    </div>
  );
};

export default ClientServices;
