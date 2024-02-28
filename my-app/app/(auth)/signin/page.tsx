"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Signin = () => {
  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
    <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
      <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
        <h1 className="mb-8 text-3xl text-center">Se Connecter</h1>

        <input
          type="text"
          className="block border border-grey-light w-full p-3 rounded mb-4"
          name="email"
          placeholder="E-mail"
        />
        <input
          type="password"
          className="block border border-grey-light w-full p-3 rounded mb-4"
          name="password"
          placeholder="Mot de passe"
        />
        
        <button
          type="submit"
          className="w-full text-center py-3 rounded bg-amber-400 text-white hover:bg-amber-300 focus:outline-none my-1"
        >
          Se Connecter
        </button>

 
      </div>

      <div className="text-grey-dark mt-6">
        Vous n'avez pas un compte?
        <Link
          className="no-underline border-b border-blue text-blue-700"
          href="/signup"
        >
          S'inscrire
        </Link>
        .
      </div>
    </div>
  </div>
  )
}

export default Signin