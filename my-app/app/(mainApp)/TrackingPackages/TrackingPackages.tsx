"use client";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  COMPANY_INFO_QUERY,
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
  name: string;
  productId: string;
}

interface ProductInCheckout {
  product: Product;
  productQuantity: number;
}

interface Checkout {
  total: number;
  productInCheckout: ProductInCheckout[];
  freeDelivery: boolean;
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
  | "RETOUR"
  | "ÉCHANGE"
  | "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON"
  | "EN TRAITEMENT"
  | "ANNULÉ"
  | "PAYÉ ET LIVRÉ"
  | "PAYÉ MAIS NON LIVRÉ";

const TrackingPackages: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [openPackageId, setOpenPackageId] = useState<string | null>(null);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      const decoded = jwt.decode(token) as DecodedToken;
      setDecodedToken(decoded);
    }
  }, []);

  const [userPackages] = useLazyQuery(GET_PACKAGES_BY_USER_ID);

  useQuery(COMPANY_INFO_QUERY, {
    onCompleted: (companyData) => {
      setDeliveryPrice(companyData.companyInfo.deliveringPrice);
    },
  });

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
      CANCELLED: "ANNULÉ",
      PAYED_AND_DELIVERED: "PAYÉ ET LIVRÉ",
      PAYED_NOT_DELIVERED: "PAYÉ MAIS NON LIVRÉ",
    };
    return statusTranslations[status] || status;
  }, []);

  const statusColors: Record<Status, string> = {
    RETOUR: "bg-blue-400",
    ÉCHANGE: "bg-purple-400",
    "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON": "bg-green-400",
    "EN TRAITEMENT": "bg-orange-400",
    ANNULÉ: "bg-gray-400",
    "PAYÉ MAIS NON LIVRÉ": "bg-green-300",
    "PAYÉ ET LIVRÉ": "bg-green-500",
  };

  const getStatusColor = (status: Status) => {
    return statusColors[status] || "bg-gray-400";
  };

  useEffect(() => {
    let filtered = packages;
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

  const isOpen = (packageId: string) => openPackageId === packageId;

  const handleRowClick = (packageId: string) => {
    setOpenPackageId((prev) => (prev === packageId ? null : packageId));
  };

  return (
    <div className="tracking-packages h-full pb-10 bg-gray-100">
      <div className="search-package border-b py-6 px-3  w-full flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 bg-white shadow">
        <input
          type="text"
          placeholder="Recherchez votre colis ou produit"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input outline-none p-3 border-primaryColor  w-96 px-5 border rounded-lg"
        />
      </div>
      <div className="package-list  py-6 px-3 h-full">
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
                  <TableHead className="text-white">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <React.Fragment key={pkg.id}>
                    <TableRow
                      className={`hover:bg-gray-50 overflow-x-auto ${
                        isOpen(pkg.id) ? "bg-gray-100" : ""
                      } cursor-pointer`}
                      onClick={() => handleRowClick(pkg.id)}
                    >
                      <TableCell className="text-xs lg:text-sm ">
                        {pkg.customId}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`${getStatusColor(
                            translateStatus(pkg.status) as Status
                          )} py-2 rounded-full px-2 lg:px-4 text-center text-white text-xs lg:text-sm font-medium`}
                        >
                          {translateStatus(pkg.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs lg:text-sm ">
                        {moment(parseInt(pkg.createdAt))
                          .locale("fr")
                          .format("lll")}
                      </TableCell>
                      <TableCell className="font-medium text-xs lg:text-sm ">
                        {pkg?.Checkout?.total?.toFixed(3) || "0.000"} DT
                      </TableCell>
                    </TableRow>
                    {isOpen(pkg.id) && (
                      <TableRow className="bg-gray-50">
                        <TableCell colSpan={4} className="p-6">
                          <div className="bg-white rounded-lg shadow-sm p-6">
                            <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                              Détails du colis
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Produits
                                </h5>
                                <ul className="space-y-2">
                                  {pkg.Checkout?.productInCheckout?.map(
                                    (product, index) => (
                                      <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-50 p-3 rounded"
                                      >
                                        <span className="text-sm font-medium">
                                          {product?.product?.name}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                          Quantité: {product?.productQuantity}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>

                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Statut du colis
                                </h5>
                                <div className="bg-gray-50 p-4 rounded">
                                  <p className="text-sm mb-2">
                                    <span className="font-medium">
                                      Statut actuel:
                                    </span>
                                    <span
                                      className={`${getStatusColor(translateStatus(pkg.status) as Status)} ml-2 py-1 px-2 rounded text-white text-xs`}
                                    >
                                      {translateStatus(pkg.status)}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Frais De Livraison
                                    </span>
                                    <span className="ml-2">
                                      {pkg.Checkout.freeDelivery
                                        ? 0.0
                                        : deliveryPrice.toFixed(3) + " " + "DT"}
                                    </span>
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">
                                      Dernière mise à jour:
                                    </span>
                                    <span className="ml-2">
                                      {moment(parseInt(pkg.createdAt))
                                        .locale("fr")
                                        .format("lll")}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6">
                              <h5 className="font-medium text-gray-700 mb-2">
                                Informations supplémentaires
                              </h5>
                              <p className="text-sm text-gray-600">
                                Autres détails spécifiques que vous souhaitez
                                montrer ici.
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center mt-10">
            <div className="border shadow-md p-6 w-full md:w-4/5 bg-white text-center rounded-lg">
              <p className="font-normal tracking-wider text-gray-600">
                {!searchInput && packages.length === 0
                  ? "Bienvenue sur notre plateforme! Vous n'avez pas encore passé de commandes. Explorez nos produits et trouvez ce que vous aimez."
                  : "Nous n'avons trouvé aucun colis correspondant à vos critères de recherche. Veuillez réessayer."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPackages;
