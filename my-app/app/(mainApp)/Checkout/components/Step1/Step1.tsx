import React from "react";
import AuthForm from "./AuthForm";
interface Step1Props {
  setIsGuest: (isGuest: boolean) => void;
  showLoginForm: boolean;
  setCurrentStep: (step: number) => void;
  setShowLoginForm: (show: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}
const Step1: React.FC<Step1Props> = ({
  setIsGuest,
  showLoginForm,
  setCurrentStep,
  setShowLoginForm,
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const handleContinueAsGuest = () => {
    setIsGuest(true);
    setCurrentStep(2);
  };
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Informations personnelles</h2>
      {!isLoggedIn && (
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={handleContinueAsGuest}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all duration-300"
            >
              Continuer en tant qu'invité
            </button>
            <button
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="w-full py-2 px-4 bg-primaryColor text-white rounded-md hover:bg-primaryColor transition-all duration-300"
            >
              Se connecter / S'inscrire
            </button>
          </div>
          {showLoginForm && (
            <AuthForm
              setIsLoggedIn={setIsLoggedIn}
              setCurrentStep={setCurrentStep}
              setShowLoginForm={setShowLoginForm}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Step1;
