import { formatDate } from "@/app/Helpers/_formatDate";
import { PointTransaction } from "@/app/types";

interface TransactionItemProps {
    transaction: PointTransaction;
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
    const getStatusClass = (type: string) => {
        return type === "EARNED"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";
    };

    return (
        <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div>
                    <span className={`px-2 py-1 rounded text-sm ${getStatusClass(transaction.type)}`}>
                        {transaction.type === "EARNED" ? "Gagné" : "Utilisé"}
                    </span>
                    <p className="mt-2 font-medium">{transaction.points} points</p>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                </div>
                <span className="text-sm text-gray-400">
                    {formatDate(transaction.createdAt)}
                </span>
            </div>
        </div>
    );
};

export default TransactionItem;