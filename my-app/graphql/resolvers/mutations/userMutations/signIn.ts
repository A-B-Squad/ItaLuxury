import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "@/pages/api/graphql";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const signIn = async (
  _: any,
  { input }: { input: SignInInput },
  { prisma, jwtSecret }: Context
) => {
  const { email, password } = input;

  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!existingUser) {
    throw new Error("Invalid email or password");
  }

  // Check if the password is correct
  const validPassword = await bcrypt.compare(password, existingUser.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  // Generate JWT token
  const token = jwt.sign({ userId: existingUser.id }, jwtSecret);

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
    user: existingUser,
    token,
  };
};
