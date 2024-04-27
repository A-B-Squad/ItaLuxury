import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { CLIENT_SERVICES } from "@/graphql/queries";

const ClientServices = () => {
  const [client1, setClient1] = useState<any>([]);
  const [client2, setClient2] = useState<any>([]);
  const [client3, setClient3] = useState<any>([]);

 
  const { loading: loadingClientService1, data: clientService1 } = useQuery(
    CLIENT_SERVICES,
    {
      variables: { position: "client_service_1" },
      onCompleted: (data) => {
        setClient1(data.advertismentByPosition);
      },
    }
  );
  const { loading: loadingClientService2, data: clientService2 } = useQuery(
    CLIENT_SERVICES,
    {
      variables: { position: "client_service_2" },
      onCompleted: (data) => {
        setClient2(data.advertismentByPosition);
      },
    }
  );
  const { loading: loadingClientService3, data: clientService3 } = useQuery(
    CLIENT_SERVICES,
    {
      variables: { position: "client_service_3" },
      onCompleted: (data) => {
        setClient3(data.advertismentByPosition);
      },
    }
  );

  return (
    <div className="service_client grid gap-5 py-10 grid-cols-1 rounded-md md:grid-cols-3 place-content-center  place-items-center">
      <>
        {client1?.length <= 0 && !loadingClientService1 && (
          <div className="flex items-center justify-center w-full h-52 rounded-lg bg-mediumBeige">
            <p>390px x 208px</p>
          </div>
        )}

        {client2?.length <= 0 && !loadingClientService2 && (
          <div className="flex items-center justify-center w-full h-52 rounded-lg bg-mediumBeige">
            <p>390px x 208px</p>
          </div>
        )}

        {client3?.length <= 0 && !loadingClientService3 && (
          <div className="flex items-center justify-center w-full h-52 col-span-2 md:col-span-1 rounded-lg bg-mediumBeige">
            <p>390px x 208px</p>
          </div>
        )}
      </>
      <>
        {!loadingClientService1 && client1?.length > 0 && (
          <Link
            href={client1[0].link}
            className="relative flex shadow-lg border-2 items-center flex-col justify-center w-full  max:w-[370px] h-full   min-h-[230px]   "
          >
            <Image
              src={client1[0].images[0]}
              alt="image 1"
              layout="fill"
              objectFit="contain"
              className=" cursor-pointer hover:opacity-50 transition-all"
            />
          </Link>
        )}

        {!loadingClientService2 && client2?.length > 0 && (
          <Link
            href={client2[0].link}
            className="relative flex shadow-xl border-2 items-center flex-col justify-center w-full  max:w-[370px] h-full   min-h-[230px]  "
          >
            <Image
              src={client2[0].images[0]}
              alt="image 2"
              layout="fill"
              objectFit="contain"
              className=" cursor-pointer hover:opacity-50 transition-all"
            />
          </Link>
        )}

        {!loadingClientService3 && client3?.length > 0 && (
          <Link
            href={client3[0].link}
            className="relative flex shadow-lg border-2 items-center flex-col col-span-1 justify-center w-full  max:w-[300px] h-full    min-h[230px]  "
          >
            <Image
              src={client3[0].images[0]}
              alt="image 3"
              layout="fill"
              objectFit="contain"
              className=" cursor-pointer hover:opacity-50 transition-all"
            />
          </Link>
        )}
      </>
      <>
        {client1?.length > 0 && loadingClientService1 && (
          <div className="grid animate-pulse w-full h-52 place-items-center rounded-lg bg-mediumBeige">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        )}

        {client2?.length > 0 && loadingClientService2 && (
          <div className="grid animate-pulse w-full h-52 place-items-center rounded-lg bg-mediumBeige">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        )}

        {client3?.length > 0 && loadingClientService3 && (
          <div className="grid animate-pulse w-full h-52 place-items-center rounded-lg bg-mediumBeige">
            <IoImageOutline className="h-12 w-12 text-gray-500" />
          </div>
        )}
      </>
    </div>
  );
};

export default ClientServices;
