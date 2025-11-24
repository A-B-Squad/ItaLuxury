import { CiSearch } from "react-icons/ci";

const EmptyState = () => (
    <div className="py-16 text-center">
        <CiSearch className="mx-auto w-20 h-20 text-gray-300 mb-4" />
        <p className="text-gray-600 text-base font-medium">
            Que recherchez-vous ?
        </p>
        <p className="text-gray-400 text-base mt-2">
            Meubles, déco, cuisine, salle de bain...
        </p>
    </div>
);
export default EmptyState