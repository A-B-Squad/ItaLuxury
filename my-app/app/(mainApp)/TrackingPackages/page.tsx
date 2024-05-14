"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useQuery,useLazyQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  GET_PACKAGES_BY_ID,
  GET_PACKAGES_BY_USER_ID,
} from "../../../graphql/queries";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "./loading";
interface Product {
  product: any;
  name: ReactNode;
  productId: string;
}
interface Checkout {
  products: Product[];
}

interface Package {
  id: string;
  Checkout: Checkout;
  status: string;
  createdAt: string;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

const TrackingPackages: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const [userPackages] = useLazyQuery(GET_PACKAGES_BY_USER_ID);

  const {
    loading: loadingPackageById,
    data: packageById,
    error: packageByIdError,
  } = useQuery(GET_PACKAGES_BY_ID, {
    variables: { packageId: searchInput },
    skip: !searchInput,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await userPackages({
          variables: { userId: decodedToken?.userId },
        });
        
        setPackages(data.packageByUserId);
      } catch (error) {
        console.error("Error fetching user packages:", error);
      }
    };
  
    if (!searchPerformed) {
      fetchData();
    }
  }, [userPackages, searchPerformed, decodedToken?.userId]);
  

  useEffect(() => {
    if (searchInput.length && packageById) {
      setPackages([packageById.packageById]);
      setSearchPerformed(true);
    } 
  }, [packageById, searchInput, userPackages, decodedToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSearchPerformed(false);
  };

  const translateStatus = (status: string) => {
    const statusTranslations = {
      PENDING: "EN ATTENTE",
      BACK: "RETOUR",
      EXCHANGE: "ÉCHANGE",
      DELIVERED: "LIVRÉ",
      PROCESSING: "EN TRAITEMENT",
      PAYED: "PAYÉ",
    };

    return statusTranslations[status] || status;
  };

  return (
    <div className="tracking-packages h-screen">
      <div className="search-package border-b py-3 px-3 w-full flex justify-center items-center">
        <input
          type="text"
          placeholder="Recherchez votre colis avec ID"
          value={searchInput}
          onChange={handleInputChange}
          className="search-input outline-none p-3 border-strongBeige w-96 px-5 border rounded"
        />
      </div>
      <div className="package-list py-3 px-3">
        { loadingPackageById ? (
          <Loading />
        ) : packages?.length > 0 ? (
          <Table>
            <TableCaption>Liste de vos colis récents.</TableCaption>
            <TableHeader className="bg-mediumBeige">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Produits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id} className="">
                  <TableCell>{pkg.id}</TableCell>
                  <TableCell>{translateStatus(pkg.status)}</TableCell>
                  <TableCell>
                    {new Date(+pkg.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <ul>
                      {pkg.Checkout.products.map((product, index) => {
                        return (
                          <li className="list-outside" key={index}>
                            {product?.product.name}
                          </li>
                        );
                      })}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>Aucun colis trouvé avec cet ID</p>
        )}
      </div>
    </div>
  );
};

export default TrackingPackages;
