import { CiLocationOn, CiPhone } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { getCompanyInfo } from "@/utlils/getCompanyInfo";


const CompanyInfoBar = async () => {
  const companyData = await getCompanyInfo();

  return (
    <div className="w-full border rounded-lg shadow-lg overflow-hidden">
      <h2 className="py-4 px-6 border-b text-xl font-semibold text-primaryColor bg-gray-50">
        Informations de contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 min-h-52 h-full divide-y md:divide-y-0 md:divide-x">
        {/* Adresse */}
        <div className="flex flex-col text-center justify-center items-center p-6 hover:bg-gray-50 transition-colors">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <CiLocationOn className="text-primaryColor" size={30} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Notre adresse</h3>
          <p className="text-gray-600">
            {companyData?.location || "Adresse non disponible"}
          </p>
        </div>

        {/* Téléphone */}
        <div className="flex flex-col justify-center items-center p-6 hover:bg-gray-50 transition-colors">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <CiPhone className="text-primaryColor" size={30} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Appelez-nous</h3>
          <p className="text-gray-600">
            {companyData?.phone ? (
              <>
                (+216) {companyData.phone[0]}
                {companyData.phone[1] && <> / (+216) {companyData.phone[1]}</>}
              </>
            ) : (
              "Numéro non disponible"
            )}
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col justify-center items-center p-6 hover:bg-gray-50 transition-colors">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <AiOutlineMail className="text-primaryColor" size={30} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Envoyez-nous un email</h3>
          <p className="text-gray-600">
            {companyData?.email || "Email non disponible"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoBar;
