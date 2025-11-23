import React from "react";
import AuthForm from "./AuthForm";
import { FaUser, FaUserShield } from "react-icons/fa";

interface Step1Props {
  setIsLoggedIn: (val: boolean) => void;
  setCurrentStep: (step: number) => void;
  setIsGuest: (val: boolean) => void;
  showLoginForm: boolean;
  setShowLoginForm: (val: boolean) => void;
  onAuthSuccess?: (userData: any) => void;
}

const Step1: React.FC<Step1Props> = ({
  setIsLoggedIn,
  setCurrentStep,
  setIsGuest,
  showLoginForm,
  setShowLoginForm,
  onAuthSuccess,
}) => {
  const handleGuestCheckout = () => {
    setIsGuest(true);
    setCurrentStep(2);
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  return (
    <div className="w-full">
      {showLoginForm ? (
        <AuthForm
          setCurrentStep={setCurrentStep}
          setShowLoginForm={setShowLoginForm}
          setIsLoggedIn={setIsLoggedIn}
          onAuthSuccess={onAuthSuccess}
          setIsGuest={setIsGuest}
        />
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Comment souhaitez-vous procéder ?
            </h2>
            <p className="text-gray-600">
              Choisissez votre mode de commande pour continuer
            </p>
          </div>

          {/* Options Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Login/Register Card */}
            <button
              type="button"
              onClick={handleLoginClick}
              className="group text-left bg-gradient-to-br from-primaryColor to-primaryColor/90 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden focus:outline-none focus:ring-4 focus:ring-primaryColor/50"
              aria-label="Se connecter ou créer un compte"
            >
              <div className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FaUser className="text-3xl text-white" aria-hidden="true" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">Se connecter</h3>

                  <p className="text-white/90 mb-6 leading-relaxed">
                    Connectez-vous ou créez un compte pour profiter de tous nos avantages
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Suivi de vos commandes
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Historique d'achats
                    </li>
                    <li className="flex items-center text-sm">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Offres exclusives
                    </li>
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <span className="text-sm font-medium">Recommandé</span>
                    <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>

            {/* Guest Card */}
            <button
              type="button"
              onClick={handleGuestCheckout}
              className="group text-left bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden focus:outline-none focus:ring-4 focus:ring-gray-300"
              aria-label="Commander en tant qu'invité"
            >
              <div className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-50 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FaUserShield className="text-3xl text-gray-600" aria-hidden="true" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Commander en tant qu'invité
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Commandez rapidement sans créer de compte
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Processus rapide
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Aucune inscription requise
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Livraison garantie
                    </li>
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Commande simple</span>
                    <svg className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Paiement 100% sécurisé • Données protégées</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1;