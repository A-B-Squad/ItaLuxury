import { FiAlertCircle } from "react-icons/fi";

const PointsErrorState = () => (
  <div className="text-center py-4">
    <FiAlertCircle className="mx-auto text-2xl text-red-500 mb-2" />
    <p className="text-sm text-red-600">Erreur de chargement des paramètres</p>
  </div>
);
export default PointsErrorState;