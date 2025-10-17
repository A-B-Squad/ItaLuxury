"use client";
import React, { useState, Suspense, memo } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/app/hooks/useAuth";
import dynamic from "next/dynamic";

// Lazy load heavy component with next/dynamic for better control
const CldUploadWidget = dynamic(() =>
  import("next-cloudinary").then(module => module.CldUploadWidget),
  { ssr: false, loading: () => null }
);

// Move GraphQL mutation to a separate hook for better organization
import { useMutation } from "@apollo/client";
import { CONTACT_US_MUTATION } from "@/graphql/mutations";

//interfaces for type safety
interface FormData {
  email: string;
  message: string;
  subject: string;
  text: string;
}

// Lightweight spinner component
const Spinner = memo(() => (
  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]">
    <span className="sr-only">Loading...</span>
  </div>
));

// File upload component (lazy loaded)
const FileUploadSection = memo(({
  register,
  fileName,
  onFileChange
}: {
  register: any;
  fileName: string;
  onFileChange: (event: any) => void;
}) => (
  <div>
    <label htmlFor="text" className="block mb-2 font-light">
      Document joint (Optionnel)
    </label>
    <div className="flex items-center h-10">
      <input
        {...register("text")}
        className="w-full outline-gray-500 cursor-not-allowed px-5 py-2 h-full border rounded-md"
        id="document"
        type="text"
        value={fileName}
        readOnly
      />
      <Suspense fallback={<div className="px-4 py-2 bg-gray-200">Chargement...</div>}>
        <CldUploadWidget
          uploadPreset="ita-luxury"
          onSuccess={(result, { widget }) => {
            onFileChange(result);
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
      </Suspense>
    </div>
  </div>
));

const ContactUsForm = () => {
  // Hooks and state
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

  // Memoized form submission handler
  const onSubmit = React.useCallback(async (data: FormData) => {
    setIsLoading(true);
    try {
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

      toast({
        title: "Merci pour votre Message",
        description: "Votre message a été envoyé avec succès!",
        className: "bg-primaryColor text-white",
      });

      reset();
      setFileName("");
      setFile(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        className: "bg-red-600 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  }, [createContactUs, decodedToken?.userId, file, toast, reset]);

  // Optimized file handler
  const handleFileInputChange = React.useCallback((event: any) => {
    const fileInfo = event.info;
    if (fileInfo) {
      const optimizedUrl = fileInfo.url.replace(
        "/upload/",
        "/upload/f_auto,q_auto/"
      );
      setFileName(fileInfo.original_filename);
      setFile(optimizedUrl);
    } else {
      setFileName("");
    }
  }, []);

  return (
    <div className="w-full border bg-white shadow-lg rounded-lg">
      <h1 className="py-4 px-2 border-b text-xl capitalize bg-gray-50">
        Contactez-Nous
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 flex items-start md:justify-evenly justify-center flex-col lg:flex-row"
      >
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Subject dropdown */}
          <div>
            <label className="block mb-2 font-light" htmlFor="subject">
              Sujet
            </label>
            <select
              id="subject"
              {...register("subject", { required: "Sujet est requis" })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 appearance-none"
              defaultValue=""
            >
              <option value="" disabled>
                Selectionner Sujet
              </option>
              <option value="Service Client">Service Client</option>
              <option value="Webmaster">Webmaster</option>
            </select>
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

          {/* File upload - lazy loaded */}
          <FileUploadSection
            register={register}
            fileName={fileName}
            onFileChange={handleFileInputChange}
          />
        </div>

        {/* Right column */}
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
              aria-busy={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner />
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

export default memo(ContactUsForm);