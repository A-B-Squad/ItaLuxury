"use client";
import { CONTACT_US_MUTATION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/hooks/useAuth";

// Define interfaces for type safety
interface FormData {
  email: string;
  message: string;
  subject: string;
  text: string;
}

// Main ContactUsForm component
const ContactUsForm: React.FC = () => {
  // Step 1: Set up hooks and state
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createContactUs] = useMutation(CONTACT_US_MUTATION);
  const { decodedToken } = useAuth();

  // Step 2: Define form submission handler
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Send mutation to create contact us entry
      await createContactUs({
        variables: {
          input: {
            userId: decodedToken?.userId,
            email: data.email,
            message: data.message,
            subject: data.subject,
            document: file,
          },
        },
      });
      // Show success toast and reset form
      toast({
        title: "Merci pour votre Message",
        description: "Votre message a été envoyé avec succès!",
        className: "bg-primaryColor text-white",
      });
      reset();
      setFileName("");
      setFile(null);
    } catch (error) {
      // Show error toast if submission fails
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        className: "bg-red-600 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };



  // Step 3: Handle file upload


  const handleFileInputChange = (event: any) => {
    const file = event.info;
    if (file) {
      const optimizedUrl = `${file.url.replace(
        "/upload/",
        "/upload/f_auto,q_auto/"
      )}`;

      setFileName(file.original_filename);
      setFile(optimizedUrl);
    } else {
      setFileName("");
    }
  };

  // Step 5: Render form
  return (
    <div className="w-full border bg-white shadow-lg rounded-lg">
      <h1 className="py-4 px-2 border-b text-xl capitalize bg-gray-50">
        Contactez-Nous
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 flex items-start md:justify-evenly justify-center flex-col lg:flex-row"
      >
        {/* Left column: Subject, Email, and File upload */}
        <div className="flex flex-col gap-4">
          {/* Subject dropdown */}
          <div>
            <label className="block mb-2 font-light" htmlFor="subject">
              Sujet
            </label>
            <div className="relative">
              <select
                style={{
                  WebkitAppearance: "none",
                  appearance: "none",
                }}
                id="subject"
                {...register("subject", { required: "Sujet est requis" })}
                className="w-full px-3 py-2 border rounded-md  focus:outline-none focus:ring focus:border-blue-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Selectionner Sujet
                </option>
                <option value="Service Client">Service Client</option>
                <option value="Webmaster">Webmaster</option>
              </select>
            </div>
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Email input */}
          <div>
            <label htmlFor="email" className="block mb-2 font-light">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email est requis" })}
              placeholder="votre@email.com"
              className="w-full px-3 py-2 outline-gray-500 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* File upload */}
          <div>
            <label htmlFor="text" className="block mb-2 font-light">
              Document joint (Optionnel)
            </label>
            <div className="flex items-center h-10">
              <div className="relative flex items-center justify-center overflow-hidden">
                <input
                  {...register("text")}
                  className="w-full outline-gray-500 cursor-not-allowed px-5 py-2 h-full border rounded-md"
                  id="document"
                  type="text"
                  value={fileName}
                  readOnly
                />
              </div>

              <CldUploadWidget
                uploadPreset="ita-luxury"
                onSuccess={(result, { widget }) => {
                  handleFileInputChange(result);
                  widget.close();
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    className="uppercase text-xs h-full flex items-center px-2 text-center text-white bg-primaryColor shadow-md hover:bg-mediumBeige transition-colors cursor-pointer"
                    onClick={() => open()}
                  >
                    choisir un image
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>

        {/* Right column: Message and Submit button */}
        <div>
          {/* Message textarea */}
          <div>
            <label htmlFor="message" className="block mb-2 font-light">
              Message
            </label>
            <textarea
              rows={8}
              cols={50}
              id="message"
              {...register("message", { required: "Message est requis" })}
              placeholder="Comment pouvons-nous aider?"
              className="w-full px-3 py-2 border outline-gray-500 rounded-md"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="float-end mt-10">
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-4 bg-primaryColor text-white shadow-lg hover:bg-mediumBeige transition-colors uppercase ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Envoi en cours...
                </div>
              ) : (
                "Envoyer"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactUsForm;
