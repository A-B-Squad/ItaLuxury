import { useAuth } from "@/app/hooks/useAuth";
import React, { useEffect } from "react";
import { FaUserAlt, FaUserSecret } from "react-icons/fa";
import AuthForm from "./AuthForm";

interface Step1Props {
  setIsGuest: (isGuest: boolean) => void;
  showLoginForm: boolean;
  setCurrentStep: (step: number) => void;
  setShowLoginForm: (show: boolean) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Step1: React.FC<Step1Props> = ({
  setIsGuest,
  showLoginForm,
  setCurrentStep,
  setShowLoginForm,
  setIsLoggedIn,
}) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is authenticated, automatically proceed to step 2
    if (isAuthenticated) {
      setIsLoggedIn(true);
      setIsGuest(false);
      setCurrentStep(2);
    }
  }, [isAuthenticated, setIsLoggedIn, setIsGuest, setCurrentStep]);

  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setCurrentStep(2);
  };

  // If user is already logged in, don't render this component
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="mb-8 max-w-3xl mx-auto opacity-100 transition-opacity duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Informations personnelles</h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-6">Choisissez comment vous souhaitez continuer votre commande:</p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="p-5 bg-gray-50 border-b">
              <div className="flex items-center justify-center mb-3">
                <FaUserSecret className="text-4xl text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800">Continuer en tant qu'invité</h3>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4 text-center">
                Commandez rapidement sans créer de compte. Aucune inscription requise.
              </p>
              <button
                onClick={handleContinueAsGuest}
                className="w-full py-3 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all duration-300 font-medium"
              >
                Continuer sans compte
              </button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="p-5 bg-primaryColor bg-opacity-10 border-b">
              <div className="flex items-center justify-center mb-3">
                <FaUserAlt className="text-4xl text-primaryColor" />
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800">Se connecter / S'inscrire</h3>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm mb-4 text-center">
                Connectez-vous pour accéder à vos informations et suivre vos commandes.
              </p>
              <button
                onClick={() => setShowLoginForm(!showLoginForm)}
                className="w-full py-3 px-4 bg-primaryColor text-white rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium"
              >
                {showLoginForm ? "Masquer le formulaire" : "Se connecter / S'inscrire"}
              </button>
            </div>
          </div>
        </div>

        {showLoginForm && (
          <div className="transition-all duration-300 ease-in-out overflow-hidden">
            <AuthForm
              setIsLoggedIn={setIsLoggedIn}
              setCurrentStep={setCurrentStep}
              setShowLoginForm={setShowLoginForm}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1;
