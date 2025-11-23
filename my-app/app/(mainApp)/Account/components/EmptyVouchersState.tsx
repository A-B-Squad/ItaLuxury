import { FiGift } from "react-icons/fi";
import { MdPointOfSale } from "react-icons/md";

interface EmptyVouchersStateProps {
    minimumPoints: number | string;
    userPoints: number;
}

const EmptyVouchersState = ({ minimumPoints, userPoints }: EmptyVouchersStateProps) => (
    <div className="text-center py-12">
        <FiGift className="mx-auto text-4xl text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">
            Aucun bon d'achat disponible
        </h3>
        <p className="text-sm text-gray-500 mb-4">
            Accumulez {minimumPoints} points pour obtenir votre premier bon d'achat.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-primaryColor">
            <MdPointOfSale />
            <span>Points actuels: {userPoints}</span>
        </div>
    </div>
);

export default EmptyVouchersState;