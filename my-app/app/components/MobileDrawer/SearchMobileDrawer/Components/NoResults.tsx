import { CiSearch } from "react-icons/ci";

const NoResults = ({ searchQuery }: { searchQuery: string }) => (
    <div className="py-12 text-center">
        <CiSearch className="mx-auto w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-600 text-base font-medium">
            Aucun résultat pour "{searchQuery}"
        </p>
        <p className="text-gray-400 text-base mt-2">
            Essayez avec d'autres mots-clés
        </p>
    </div>
);

export default NoResults