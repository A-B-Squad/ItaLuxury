"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
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
import { useAuth } from "@/app/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPackage, FiClock, FiInfo } from "react-icons/fi";
import { ProductData } from "@/app/types";

interface Product {
  product: ProductData;
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


type Status =
  | "RETOUR"
  | "COMMANDE CONFIRMÉE"
  | "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON"
  | "EN TRAITEMENT"
  | "ANNULÉ"
  | "PAYÉ ET LIVRÉ"
  | "PAYÉ MAIS NON LIVRÉ";

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

const TrackingPackages = ({ companyData }: any) => {
  const [searchInput, setSearchInput] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [openPackageId, setOpenPackageId] = useState<string | null>(null);
  const { decodedToken, isAuthenticated } = useAuth();
  const deliveryPrice: number = companyData?.deliveringPrice ?? 8;

  const [PackageByUserId] = useLazyQuery(GET_PACKAGES_BY_USER_ID);



  const { data: packageById } = useQuery(
    GET_PACKAGES_BY_ID,
    {
      variables: { packageId: searchInput },
      skip: !searchInput,
    },
  );
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          const { data } = await PackageByUserId({
            variables: { userId: decodedToken?.userId },
          });
          if (data?.packageByUserId) {
            setPackages(data.packageByUserId);
          }
        } catch (error) {
          console.error("Error fetching user packages:", error);
        }
      }
    };

    if (!searchPerformed && isAuthenticated) {
      fetchData();
    }
  }, [PackageByUserId, searchPerformed, isAuthenticated, decodedToken]);

  useEffect(() => {
    if (searchInput && packageById?.packageById) {
      setPackages([packageById.packageById]);
      setSearchPerformed(true);
    } else if (!searchInput) {
      setSearchPerformed(false);
    }
  }, [packageById, searchInput]);

  const translateStatus = useCallback((status: string): Status => {
    const statusTranslations: { [key: string]: Status } = {
      BACK: "RETOUR",
      CONFIRMED: "COMMANDE CONFIRMÉE",
      TRANSFER_TO_DELIVERY_COMPANY: "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON",
      PROCESSING: "EN TRAITEMENT",
      CANCELLED: "ANNULÉ",
      PAYED_AND_DELIVERED: "PAYÉ ET LIVRÉ",
      PAYED_NOT_DELIVERED: "PAYÉ MAIS NON LIVRÉ",
    };
    return statusTranslations[status] || status;
  }, []);

  const statusColors: Record<Status, string> = {
    RETOUR: "bg-blue-500",
    "COMMANDE CONFIRMÉE": "bg-purple-500",
    "TRANSFÉRÉ À LA SOCIÉTÉ DE LIVRAISON": "bg-green-500",
    "EN TRAITEMENT": "bg-orange-500",
    ANNULÉ: "bg-gray-500",
    "PAYÉ MAIS NON LIVRÉ": "bg-green-400",
    "PAYÉ ET LIVRÉ": "bg-green-600",
  };

  const getStatusColor = useCallback((status: Status) => {
    return statusColors[status] || "bg-gray-500";
  }, [statusColors]);

  useEffect(() => {
    let filtered = packages;
    if (searchInput) {
      filtered = filtered.filter(
        (pkg) =>
          pkg?.customId?.toLowerCase().includes(searchInput.toLowerCase()) ||
          pkg.Checkout?.productInCheckout.some((product) =>
            product.product.name
              .toLowerCase()
              .includes(searchInput.toLowerCase()),
          ),
      );
    }
    setFilteredPackages(filtered);
  }, [packages, searchInput]);

  const isOpen = useCallback((packageId: string) => openPackageId === packageId, [openPackageId]);

  const handleRowClick = useCallback((packageId: string) => {
    setOpenPackageId((prev) => (prev === packageId ? null : packageId));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);


  return (
    <motion.div
      className="tracking-packages min-h-screen pb-20 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="search-package border-b py-6 px-4 w-full flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 bg-white shadow-sm">
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Recherchez par ID ou nom de produit"
            value={searchInput}
            onChange={handleSearchChange}
            className="search-input pl-10 outline-none p-3 border-gray-300 focus:border-primaryColor focus:ring-1 focus:ring-primaryColor w-full px-5 border rounded-lg transition-all"
          />
        </div>
      </div>

      <div className="package-list py-8 px-4 container mx-auto">
        {
          filteredPackages.length > 0 ? (
            <motion.div
              className="overflow-x-auto rounded-lg shadow"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Table className="border bg-white rounded-lg">
                <TableCaption className="mt-4 mb-2 text-gray-500">
                  Liste de vos colis récents
                </TableCaption>
                <TableHeader className="bg-primaryColor text-white">
                  <TableRow>
                    <TableHead className="text-white font-medium">ID</TableHead>
                    <TableHead className="text-white font-medium">Statut</TableHead>
                    <TableHead className="text-white font-medium">Créé le</TableHead>
                    <TableHead className="text-white font-medium">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.map((pkg) => (
                    <React.Fragment key={pkg.id}>
                      <TableRow
                        className={`hover:bg-gray-50 transition-colors ${isOpen(pkg.id) ? "bg-gray-100" : ""} cursor-pointer`}
                        onClick={() => handleRowClick(pkg.id)}
                      >
                        <TableCell className="text-xs lg:text-sm font-medium">
                          {pkg.customId}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(translateStatus(pkg.status) as Status)} hover:${getStatusColor(translateStatus(pkg.status) as Status)} py-1 px-2 text-xs text-white`}
                          >
                            {translateStatus(pkg.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs lg:text-sm text-gray-600">
                          {moment(parseInt(pkg.createdAt))
                            .locale("fr")
                            .format("lll")}
                        </TableCell>
                        <TableCell className="font-medium text-xs lg:text-sm">
                          {pkg?.Checkout?.total?.toFixed(3) || "0.000"} DT
                        </TableCell>
                      </TableRow>

                      <AnimatePresence>
                        {isOpen(pkg.id) && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={4} className="p-0">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-white rounded-lg shadow-sm p-6 m-4">
                                  <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center">
                                    <FiInfo className="mr-2" /> Détails du colis
                                  </h4>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                                        <FiPackage className="mr-2" size={16} /> Produits
                                      </h5>
                                      <ul className="space-y-2">
                                        {pkg.Checkout?.productInCheckout?.map(
                                          (product, index) => (
                                            <li
                                              key={index}
                                              className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-100"
                                            >
                                              <span className="text-sm font-medium">
                                                {product?.product?.name}
                                              </span>
                                              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                Qté: {product?.productQuantity}
                                              </span>
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>

                                    <div>
                                      <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                                        <FiClock className="mr-2" size={16} /> Statut du colis
                                      </h5>
                                      <div className="bg-gray-50 p-4 rounded border border-gray-100">
                                        <p className="text-sm mb-3 flex items-center">
                                          <span className="font-medium w-40">Statut actuel:</span>
                                          <Badge
                                            className={`${getStatusColor(translateStatus(pkg.status) as Status)} hover:${getStatusColor(translateStatus(pkg.status) as Status)} py-1 px-2 text-xs text-white`}
                                          >
                                            {translateStatus(pkg.status)}
                                          </Badge>
                                        </p>
                                        <p className="text-sm mb-3 flex items-center">
                                          <span className="font-medium w-40">Frais de livraison:</span>
                                          <span className="text-gray-700">
                                            {pkg.Checkout.freeDelivery
                                              ? "Gratuit"
                                              : `${deliveryPrice.toFixed(3)} DT`}
                                          </span>
                                        </p>
                                        <p className="text-sm flex items-center">
                                          <span className="font-medium w-40">Dernière mise à jour:</span>
                                          <span className="text-gray-700">
                                            {moment(parseInt(pkg.createdAt))
                                              .locale("fr")
                                              .format("lll")}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center justify-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="border shadow-sm p-8 w-full md:w-4/5 bg-white text-center rounded-lg">
                <FiPackage className="mx-auto mb-4 text-gray-400" size={40} />
                <h2 className="text-xl font-semibold mb-2 text-gray-700">
                  {!searchInput && packages.length === 0 ? "Aucun colis trouvé" : "Recherche sans résultats"}
                </h2>
                <p className="font-normal tracking-wider text-gray-600">
                  {!searchInput && packages.length === 0
                    ? "Bienvenue sur notre plateforme! Vous n'avez pas encore passé de commandes. Explorez nos produits et trouvez ce que vous aimez."
                    : "Nous n'avons trouvé aucun colis correspondant à vos critères de recherche. Veuillez réessayer."}
                </p>
              </div>
            </motion.div >
          )}
      </div>
    </motion.div >
  );
};

export default TrackingPackages;
