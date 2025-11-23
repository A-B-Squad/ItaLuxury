import React from 'react';
import { CiMail, CiPhone, CiUser } from "react-icons/ci";
import CheckoutPayment from '../Step3/CheckoutPayment';

interface CheckoutFormProps {
  currentStep: number;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  isValid: boolean;
  errors: any;
  register: any;
  isLoggedIn: boolean;
  governmentInfo: Array<{ id: string, name: string }>;
  handlePreviousStep: () => void;
  loading: boolean;
  paymentLoading: boolean;
  submitLoading: boolean;
  paymentMethod: "CASH_ON_DELIVERY" | "CREDIT_CARD";
  setPaymentMethod: (method: "CASH_ON_DELIVERY" | "CREDIT_CARD") => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  currentStep,
  handleSubmit,
  onSubmit,
  isValid,
  errors,
  register,
  isLoggedIn,
  governmentInfo,
  handlePreviousStep,
  loading,
  paymentLoading,
  submitLoading,
  paymentMethod,
  setPaymentMethod
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!isValid && Object.keys(errors).length > 0 && (
        <p className="text-red-500 mb-4">
          Veuillez remplir tous les champs requis correctement.
        </p>
      )}
      {currentStep === 2 && (
        <div className="flex flex-col w-full">
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">
              Adresse de livraison
            </h2>

            {/* Full Name Input */}
            <label
              htmlFor="fullname"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              <CiUser className="inline-block mr-2 mb-1" /> Nom et
              Prénom <span className="text-gray-500 text-xs">(الاسم واللقب)</span>
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullname", {
                required: "Ce champ est requis",
              })}
              className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-mabg-primaryColor focus:ring-mabg-primaryColor"
              placeholder="Nom et prénom / الاسم واللقب"
            />
            {errors.fullname && (
              <p className="text-red-500">
                {errors.fullname.message as string}
              </p>
            )}

            {/* Email Input (for guest users) */}
            {!isLoggedIn && (
              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  <CiMail className="inline-block mr-2 align-text-bottom" />{" "}
                  Email (optionnel) <span className="text-gray-500 text-xs">(البريد الإلكتروني)</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      pattern: {
                        value:
                          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Adresse e-mail invalide",
                      },
                    })}
                    className="border border-gray-300 rounded-r-md px-4 py-2 w-full focus:outline-none "
                    placeholder="votre@email.com / بريدك الإلكتروني"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CiMail
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                {errors.email && (
                  <p
                    className="mt-2 text-sm text-red-600"
                    id="email-error"
                  >
                    {errors.email.message as string}
                  </p>
                )}
                <p
                  className="mt-2 text-sm text-gray-500"
                  id="email-description"
                >
                  Fournir votre email nous permettra de vous envoyer
                  des mises à jour sur votre commande.
                </p>
              </div>
            )}

            {/* Phone 1 Input */}
            <label
              htmlFor="phone_1"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              <CiPhone className="inline-block mr-2 mb-1" /> Téléphone
              1 <span className="text-gray-500 text-xs">(رقم الهاتف)</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-gray-600">
                +216
              </span>
              <input
                type="tel"
                id="phone_1"
                className="border border-gray-300 rounded-r-md px-4 py-2 w-full focus:outline-none "
                {...register("phone_1", {
                  required: "Ce champ est requis",
                  validate: (value: string) => {
                    const cleaned = value.replaceAll(/\s+/g, '');
                    return cleaned.length === 8 && /^\d+$/.test(cleaned) ||
                      "Le numéro de téléphone doit comporter 8 chiffres";
                  }
                })}
                placeholder="Numéro de téléphone / رقم الهاتف"
              />
            </div>

            {errors.phone_1 && (
              <p className="text-red-500">
                {errors.phone_1.message as string}
              </p>
            )}

            {/* Phone 2 Input (Optional) */}
            <label
              htmlFor="phone_2"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              <CiPhone className="inline-block mr-2 mb-1" /> Téléphone
              2 (optional) <span className="text-gray-500 text-xs">(رقم هاتف إضافي)</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-gray-600">
                +216
              </span>
              <input
                type="tel"
                id="phone_2"
                className="border border-gray-300 rounded-r-md px-4 py-2 w-full focus:outline-none "
                {...register("phone_2", {
                  validate: (value: string) => {
                    if (!value) return true; // Optional field
                    // Remove spaces for validation
                    const cleaned = value.replaceAll(/\s+/g, '');
                    return cleaned.length === 8 && /^\d+$/.test(cleaned) ||
                      "Le numéro de téléphone doit comporter 8 chiffres";
                  }
                })}
                placeholder="Numéro de téléphone / رقم هاتف إضافي"
              />
            </div>

            {errors.phone_2 && (
              <p className="text-red-500">
                {errors.phone_2.message as string}
              </p>
            )}

            {/* Governorate Selection */}
            <label
              htmlFor="governorate"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Governorat <span className="text-gray-500 text-xs">(الولاية)</span>
            </label>
            <select
              id="governorate"
              {...register("governorate", {
                required: "Veuillez sélectionner un gouvernorat",
              })}
              className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-sm shadow-sm outline-none focus:z-10 focus:border-mabg-primaryColor focus:ring-mabg-primaryColor"
            >
              <option value="">Sélectionner une governorat / اختر الولاية</option>
              {governmentInfo.map((government: { id: string, name: string }) => (
                <option key={government.id} value={government.id}>
                  {government.name.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.governorate && (
              <p className="text-red-500">Ce champ est requis</p>
            )}

            {/* Address Input */}
            <label
              htmlFor="address"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Adresse <span className="text-gray-500 text-xs">(العنوان)</span>
            </label>
            <textarea
              id="address"
              {...register("address", {
                required: "L'adresse est requise",
              })}
              className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-mabg-primaryColor focus:ring-mabg-primaryColor"
              placeholder="Saisissez votre adresse / أدخل عنوانك"
              rows={3}
            ></textarea>
            {errors.address && (
              <p className="text-red-500">Ce champ est requis</p>
            )}

            <div className="mb-8">
              <label
                htmlFor="deliveryComment"
                className="block text-sm font-medium text-gray-700"
              >
                Commentaire pour la livraison (optionnel) <span className="text-gray-500 text-xs">(ملاحظات للتوصيل)</span>
              </label>
              <textarea
                id="deliveryComment"
                {...register("deliveryComment")}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-primaryColor focus:ring-1 focus:ring-primaryColor"
                placeholder="Ajoutez des instructions spéciales pour la livraison ici... / أضف تعليمات خاصة للتوصيل هنا"
              ></textarea>
            </div>
          </div>
        </div>
      )}


      {currentStep === 3 && (
        <CheckoutPayment
          isValid={isValid}
          handlePreviousStep={handlePreviousStep}
          loading={loading}
          paymentLoading={paymentLoading}
          submitLoading={submitLoading}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      )}
    </form>)
}

export default CheckoutForm