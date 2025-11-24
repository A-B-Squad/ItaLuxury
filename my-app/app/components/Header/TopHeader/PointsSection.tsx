import { PointTransaction } from "@/app/types";
import { formatAmount } from "./Helper/formatAmount";
import { formatDate } from "@/app/Helpers/_formatDate";
import getTransactionIcon from "./Helper/getTransactionIcon";
import getTransactionColor from "./Helper/getTransactionColor";


const PointsSection = ({ userData }: { userData: any }) => {
    const userPoints = userData?.points || 0;
    const transactions = userData?.pointTransactions || [];
    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Mes Points</h3>
                <div className="bg-gradient-to-r from-primaryColor to-amber-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {formatAmount(userPoints)} pts
                </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.length > 0 ? (
                    transactions.map((transaction: PointTransaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                {getTransactionIcon(transaction.type)}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                                    <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                                </div>
                            </div>
                            <div className={`text-sm font-semibold ${getTransactionColor(transaction.amount)}`}>
                                {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)} pts
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
export default PointsSection