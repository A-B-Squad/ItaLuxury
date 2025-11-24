import { PointTransaction } from "@/app/types";
import getTransactionIcon from "./Helper/getTransactionIcon";
import getTransactionColor from "./Helper/getTransactionColor";
import { formatAmount } from "./Helper/formatAmount";
import { FiClock } from "react-icons/fi";
import { formatDate } from "@/app/Helpers/_formatDate";

const TransactionsSection = ({ userData }: { userData: any }) => {
    const transactions = userData?.pointTransactions || [];
    const sortedTransactions = [...transactions].sort((a, b) => Number.parseInt(b.createdAt) - Number.parseInt(a.createdAt));

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Historique des Transactions</h3>
                <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {transactions.length} transactions
                </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
                {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((transaction: PointTransaction) => (
                        <div key={transaction.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-1 rounded-full ">
                                {getTransactionIcon(transaction.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                                    <span className={`text-sm font-semibold ${getTransactionColor(transaction.amount)}`}>
                                        {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)} pts
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <FiClock size={12} />
                                    {formatDate(transaction.createdAt)}
                                    <span className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                                        {transaction.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">Aucune transaction trouvée</p>
                )}
            </div>
        </div>
    );
};

export default TransactionsSection