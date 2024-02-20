import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
import { Context } from "../../../../pages/api/graphql";


export const signUp = async (_: any,{ input }: { input: SignUpInput }, { prisma, jwtSecret }: Context) => {
    const { fullName, email, password, number } = input;
    // Check if the email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("Email address is already in use");
    }

    // hash password
    const hashedPassword = await bcrypt.hashSync(password, 10);

    // create new user
    const newUser = await prisma.user.create({
      data:{
        fullName,
        email,
        password:hashedPassword,
        number,
        role:'USER'
      }
    })

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, jwtSecret);

    return {
        user: newUser,
        token
    };
  }


=======
import { Context } from "@/pages/api/graphql";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const signUp = async (
  _: any,
  { input }: { input: SignUpInput },
  { prisma, jwtSecret }: Context
) => {
  const { fullName, email, password, number } = input;
  // Check if the email is already in use
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("Email address is already in use");
  }

  // hash password
  const hashedPassword = await bcrypt.hashSync(password, 10);

  // create new user
  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      number,
      role: "USER",
    },
  });

  // Generate JWT token
  const token = jwt.sign({ userId: newUser.id }, jwtSecret);

  // Set the cookie
  const response = new NextResponse();
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 2592000, //   30 days
  });

  return {
    user: newUser,
    token,
  };
};
>>>>>>> 0ac3bad1b7b116b8b7448d65a2c31ff0bb62229f
