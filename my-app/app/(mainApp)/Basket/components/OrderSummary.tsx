import Link from "next/link";
import { BiGift } from "react-icons/bi";

interface OrderSummaryProps {
    productsCount: number;
    subtotal: number;
    totalDiscount: number;
    deliveryFee: number;
    hasFreeDelivery: boolean;
    totalPrice: number;
    onProceedToCheckout: () => void;
}

export const OrderSummary = ({
    productsCount,
    subtotal,
    totalDiscount,
    deliveryFee,
    hasFreeDelivery,
    totalPrice,
    onProceedToCheckout
}: OrderSummaryProps) => {
    return (
        <div className="bg-white h-fit sticky top-24 shadow-xl rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">
                Récapitulatif de la commande
            </h3>
            
            <ul className="space-y-4 mb-6">
                <li className="flex justify-between text-gray-600">
                    <span>
                        {productsCount} article{productsCount > 1 ? "s" : ""}
                    </span>
                    <span className="font-semibold">
                        {subtotal.toFixed(3)} TND
                    </span>
                </li>

                {totalDiscount > 0 && (
                    <li className="flex justify-between items-center bg-green-50 -mx-2 px-2 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                            <BiGift className="text-green-600" size={18} />
                            <span className="font-semibold text-green-700">Réduction Bundle</span>
                        </div>
                        <span className="font-bold text-green-600">
                            -{totalDiscount.toFixed(3)} TND
                        </span>
                    </li>
                )}

                <li className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-semibold">
                        {hasFreeDelivery ? (
                            <span className="text-green-600 font-bold flex items-center gap-1">
                                <BiGift size={18} />
                                Gratuit
                            </span>
                        ) : deliveryFee === 0 ? (
                            "Gratuit"
                        ) : (
                            `${deliveryFee.toFixed(2)} TND`
                        )}
                    </span>
                </li>

                <li className="flex justify-between text-gray-800 font-bold text-lg border-t pt-4">
                    <span>Total (TTC)</span>
                    <span>{(totalPrice + deliveryFee).toFixed(3)} TND</span>
                </li>
            </ul>

            {totalDiscount > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl mb-4 shadow-lg">
                    <div className="absolute inset-0 bg-white opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                        backgroundSize: '16px 16px'
                    }}></div>
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                <BiGift className="text-white" size={24} />
                            </div>
                            <div>
                                <p className="text-white text-xs font-semibold uppercase tracking-wide">
                                    Économies totales
                                </p>
                                <p className="text-white text-2xl font-bold">
                                    {totalDiscount.toFixed(3)} TND
                                </p>
                            </div>
                        </div>
                        <div className="text-white text-4xl opacity-20">🎉</div>
                    </div>
                </div>
            )}

            <Link
                onClick={onProceedToCheckout}
                href="/Checkout"
                className="block w-full text-center py-3 px-4 bg-primaryColor text-white font-semibold rounded hover:bg-amber-200 transition-colors"
            >
                Confirmer le paiement
            </Link>
        </div>
    );
};
