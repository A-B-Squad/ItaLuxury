import { formatDate } from "@/app/Helpers/_formatDate";
import { Voucher } from "@/app/types";

// Voucher Item Component
interface VoucherItemProps {
    voucher: Voucher;
}

const VoucherItem = ({ voucher }: VoucherItemProps) => {
    const statusClass = voucher.isUsed
        ? "bg-gray-200 text-gray-600"
        : "bg-green-100 text-green-800";

    return (
        <div className={`border rounded-lg p-4 ${voucher.isUsed ? "opacity-60" : ""}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-2xl font-bold text-primaryColor">
                        {voucher.amount} TND
                    </p>
                    <p className="text-sm text-gray-500">Code: {voucher.code}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${statusClass}`}>
                    {voucher.isUsed ? "Utilisé" : "Disponible"}
                </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
                <p>
                    Expire le:{" "}
                    {voucher.expiresAt ? formatDate(voucher.expiresAt) : "Date non disponible"}
                </p>
                {voucher.usedAt && <p>Utilisé le: {formatDate(voucher.usedAt)}</p>}
            </div>
        </div>
    );
};

export default VoucherItem;