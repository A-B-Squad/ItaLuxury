"use client";
import { CONTACT_US_MUTATION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadButton } from "next-cloudinary";

const ContactUsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [createContactUs] = useMutation(CONTACT_US_MUTATION);
  const onSubmit = (data: any) => {
    createContactUs({
      variables: {
        input: {
          email: data.email,
          message: data.message,
          subject: data.subject,
          document: file,
        },
      },
    });
  };

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    } else {
      setFileName("");
    }
  };
  
  return (
    <div className="w-full border bg-white shadow-lg rounded-lg">
      <h1 className="py-4 px-2 border-b text-xl capitalize bg-gray-50">
        Contactez-Nous
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 flex items-start md:justify-evenly justify-center flex-col lg:flex-row"
      >
        <div className="flex flex-col  gap-4">
          <div>
            <label className="block mb-2 font-light" htmlFor="subject">
              Sujet
            </label>
            <div className="relative">
              <select
                id="subject"
                {...register("subject", { required: "Sujet est requis" })}
                className="w-full px-3 py-2 border rounded-md appearance-none focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="" disabled selected>
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

          <div>
            <label htmlFor="text" className="block mb-2 font-light">
              Document joint (Optionnel)
            </label>
            <div className="flex items-center h-10 ">
              <div className="relative flex items-center justify-center overflow-hidden">
                <input
                  {...register("text")}
                  className="w-full outline-gray-500 cursor-not-allowed px-5  py-2 h-full border rounded-md"
                  id="document"
                  type="text"
                  value={fileName}
                  readOnly
                />
              </div>
              <input
                className="file hidden "
                id="fileInput"
                type="file"
                onChange={handleFileInputChange}
              />
              <CldUploadButton uploadPreset="CLOUDINARY_URL=cloudinary://753318569248793:jjndVxE9XwyNBxqGAeT-1YKpm1Q@dc1cdbirz" />

              <label
                htmlFor="fileInput"
                className=" uppercase text-xs h-full flex items-center px-2 text-center text-white bg-strongBeige shadow-md hover:bg-mediumBeige transition-colors cursor-pointer"
              >
                choisir un fichier
              </label>
            </div>
          </div>
        </div>
        <div>
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

          <div className="float-end mt-10">
            <button
              type="submit"
              className=" py-2 px-4 bg-strongBeige text-white  shadow-lg hover:bg-mediumBeige transition-colors uppercase"
            >
              Envoyer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactUsForm;
