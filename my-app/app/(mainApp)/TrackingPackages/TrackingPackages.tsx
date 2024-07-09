"use client";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
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
import moment from "moment-timezone";
import "moment/locale/fr";

interface Product {
  product: any;
  name: ReactNode;
  productId: string;
}

interface Checkout {
  [x: string]: any;
  productInCheckout: Product[];
}

interface Package {
  id: string;
  customId: string;
  Checkout: Checkout;
  status: string;
  createdAt: string;
}

interface DecodedToken extends JwtPayload {
  userId: string;
}

type Status =
  | "EN ATTENTE"
  | "RETOUR"
  | "ÉCHANGE"
  | "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON"
  | "EN TRAITEMENT"
  | "PAYÉ"
  | "ANNULÉ";

const TrackingPackages: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
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

  const { loading: loadingPackageById, data: packageById } = useQuery(
    GET_PACKAGES_BY_ID,
    {
      variables: { packageId: searchInput },
      skip: !searchInput,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      if (decodedToken?.userId) {
        try {
          const { data } = await userPackages({
            variables: { userId: decodedToken.userId },
          });

          if (data && data.packageByUserId) {
            setPackages(data.packageByUserId);
          }
        } catch (error) {
          console.error("Error fetching user packages:", error);
        }
      }
    };

    if (!searchPerformed && decodedToken?.userId) {
      fetchData();
    }
  }, [userPackages, searchPerformed, decodedToken?.userId]);

  useEffect(() => {
    if (searchInput.length && packageById) {
      if (packageById.packageById) {
        setPackages([packageById.packageById]);
      } else {
        setPackages([]);
      }
      setSearchPerformed(true);
    }
  }, [packageById, searchInput]);

  const translateStatus = useCallback((status: string): Status => {
    const statusTranslations: { [key: string]: Status } = {
      BACK: "RETOUR",
      EXCHANGE: "ÉCHANGE",
      TRANSFER_TO_DELIVERY_COMPANY: "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON",
      PROCESSING: "EN TRAITEMENT",
      PAYED: "PAYÉ",
      CANCELLED: "ANNULÉ",
    };
    return statusTranslations[status] || status;
  }, []);

  const statusColors: Record<Status, string> = {
    "EN ATTENTE": "bg-yellow-400",
    RETOUR: "bg-blue-400",
    ÉCHANGE: "bg-purple-400",
    "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON": "bg-green-400",
    "EN TRAITEMENT": "bg-orange-400",
    PAYÉ: "bg-green-400",
    ANNULÉ: "bg-gray-400",
  };

  const getStatusColor = (status: Status) => {
    return statusColors[status] || "bg-gray-400";
  };

  useEffect(() => {
    let filtered = packages;
    console.log(filtered, "filtered packages");

    if (searchInput) {
      filtered = filtered.filter(
        (pkg) =>
          pkg?.customId?.toLowerCase().includes(searchInput.toLowerCase()) ||
          pkg.Checkout?.productInCheckout.some((product) =>
            product.product.name
              .toLowerCase()
              .includes(searchInput.toLowerCase())
          )
      );
    }
    setFilteredPackages(filtered);
  }, [packages, searchInput]);
  return (
    <div className="tracking-packages h-full pb-10 bg-gray-100">
      <div className="search-package border-b py-6 px-3 w-full flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 bg-white shadow">
        <input
          type="text"
          placeholder="Recherchez votre colis ou produit"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input outline-none p-3 border-primaryColor w-full md:w-96 px-5 border rounded-lg"
        />
      </div>
      <div className="package-list py-6 px-3 h-full">
        {loadingPackageById ? (
          <Loading />
        ) : filteredPackages.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="border bg-white rounded-lg shadow">
              <TableCaption>Liste de vos colis récents.</TableCaption>
              <TableHeader className="bg-[#cc8c70] text-white">
                <TableRow>
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Statut</TableHead>
                  <TableHead className="text-white">Créé le</TableHead>
                  <TableHead className="text-white">Produits</TableHead>
                  <TableHead className="text-white">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => {
     

                  return (
                    <TableRow key={pkg.id} className="hover:bg-gray-50">
                      <TableCell>{pkg.customId}</TableCell>
                      <TableCell>
                        <span
                          className={`${getStatusColor(translateStatus(pkg.status) as Status)} py-2 rounded-full px-4 text-center text-white text-sm font-medium`}
                        >
                          {translateStatus(pkg.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {moment(parseInt (pkg.createdAt)).locale("fr").format("lll")}
                      </TableCell>
                      <TableCell>
                        <ul className="list-disc pl-5">
                          {pkg.Checkout?.productInCheckout?.map(
                            (product, index) => (
                              <li key={index} className="text-sm">
                                {product?.product?.name}
                              </li>
                            )
                          ) || []}
                        </ul>
                      </TableCell>
                      <TableCell className="font-medium">
                        {pkg?.Checkout?.total?.toFixed(3) || "0.000"} DT
                      </TableCell>
                    
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center mt-10">
            <div className="border shadow-md p-6 w-full md:w-4/5 bg-white text-center rounded-lg">
              <p className="font-normal tracking-wider text-gray-600">
                {!searchInput && packages.length === 0
                  ? "Bienvenue sur notre plateforme! Vous n'avez pas encore passé de commandes. Explorez nos produits et trouvez ce que vous aimez."
                  : "Nous n'avons trouvé aucun colis correspondant à vos critères. Veuillez vérifier votre saisie ou modifier vos filtres."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPackages;
