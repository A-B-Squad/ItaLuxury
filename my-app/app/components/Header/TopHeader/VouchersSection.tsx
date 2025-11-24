import { Voucher } from "@/app/types";
import { FiCheck, FiX } from "react-icons/fi";
import { formatAmount } from "./Helper/formatAmount";
import { formatDate } from "@/app/Helpers/_formatDate";

const VouchersSection = ({ userData }: { userData: any }) => {
    const vouchers = userData?.Voucher || [];
    const activeVouchers = vouchers.filter((v: Voucher) => !v.isUsed);
    const usedVouchers = vouchers.filter((v: Voucher) => v.isUsed);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Mes Bons</h3>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {activeVouchers.length} actifs
                </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
                {activeVouchers.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                            <FiCheck size={14} />
                            Bons Actifs
                        </h4>
                        {activeVouchers.map((voucher: Voucher) => (
                            <div key={voucher.id} className="border border-green-200 bg-green-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">{voucher.code}</p>
                                        <p className="text-xs text-gray-600">Expire le: {formatDate(voucher.expiresAt)}</p>
                                    </div>
                                    <div className="bg-green-600 text-white px-2 py-1 rounded-md text-sm font-bold">
                                        {formatAmount(voucher.amount)} TND
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {usedVouchers.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                            <FiX size={14} />
                            Bons Utilisés
                        </h4>
                        {usedVouchers.map((voucher: Voucher) => (
                            <div key={voucher.id} className="border border-gray-200 bg-gray-50 rounded-lg p-3 opacity-75">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-600">{voucher.code}</p>
                                        <p className="text-xs text-gray-500">Utilisé le: {voucher.usedAt ? formatDate(voucher.usedAt) : 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-400 text-white px-2 py-1 rounded-md text-sm font-bold">
                                        {formatAmount(voucher.amount)} TND
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {vouchers.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Aucun bon trouvé</p>
                )}
            </div>
        </div>
    );
};

export default VouchersSection