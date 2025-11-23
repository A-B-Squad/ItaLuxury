import { PointTransaction } from "@/app/types";
import { MdPointOfSale } from "react-icons/md";
import TransactionItem from "./TransactionItem";

interface TransactionsListProps {
    transactions: PointTransaction[] | undefined;
}

const TransactionsList = ({ transactions }: TransactionsListProps) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <MdPointOfSale className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Aucune transaction
                </h3>
                <p className="text-sm text-gray-500">
                    Vos transactions de points apparaîtront ici.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
        </div>
    );
};

export default TransactionsList;