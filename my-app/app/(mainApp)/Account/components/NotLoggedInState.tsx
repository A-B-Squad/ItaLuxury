import { FiAlertCircle } from "react-icons/fi";

const NotLoggedInState = () => (
    <div className="container py-8 px-4 md:px-8 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
                <FiAlertCircle className="mx-auto text-6xl text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Compte non trouvé
                </h2>
                <p className="text-gray-500">
                    Veuillez vous connecter pour accéder à votre compte.
                </p>
            </div>
        </div>
    </div>
);
export default NotLoggedInState;