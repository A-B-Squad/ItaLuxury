import { FiGift, FiTrendingUp } from "react-icons/fi";

const getTransactionIcon = (type: string) => {
    switch (type) {
        case 'ADMIN_ADDED':
            return <FiTrendingUp className="text-green-600" />;
        case 'ADJUSTMENT':
            return <FiGift className="text-blue-600" />;
        default:
            return <FiTrendingUp className="text-gray-600" />;
    }
};
export default getTransactionIcon