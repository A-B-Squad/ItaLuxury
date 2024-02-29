import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Context } from "@/pages/api/graphql";
import { NextResponse } from "next/server";

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
    return new Error("Invalid email or password");
  }

  // Check if the password is correct
  const validPassword = await bcrypt.compare(password, existingUser.password);
  if (!validPassword) {
    return new Error("Invalid password");
  }

  // Generate JWT token
  const token = jwt.sign({ userId: existingUser.id }, jwtSecret, { expiresIn: '1h' });

  // Set the cookie
  const response = new NextResponse();
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, //   1 H
  });

  return {
    user: existingUser,
    token,
  };
};



export const refreshToken = async (
  _: any,
  { Token }: { Token: string },
  { jwtSecret }: Context
) => {
  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(Token, jwtSecret);
    console.log(decodedToken);

    // If the Token is valid, generate a new access Token
    const accessToken = jwt.sign({ userId: decodedToken.userId }, jwtSecret, { expiresIn: '1h' });

    // Set the new access Token in the cookie
    const response = new NextResponse();
    response.cookies.set("Token", accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
    });

    // Return the new access Token
    return accessToken;
  } catch (error) {
    // Handle invalid or expired refresh tokens
    return new Error("Invalid or expired refresh Token");
  }
};
