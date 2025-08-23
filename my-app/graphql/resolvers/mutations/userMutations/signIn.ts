import { Context } from "@apollo/client";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

export const signIn = async (
  _: any,
  { input }: { input: SignInInput },
  { prisma, jwtSecret }: Context
) => {
  const { emailOrPhone, password } = input;

  if (!emailOrPhone || !password) {
    throw new Error("Invalid credentials");
  }
  if (emailOrPhone.trim().length > 254) {
    throw new Error("Invalid credentials");
  }
  // Check if the input is an email or a phone number
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
  const isPhone = /^[0-9]{8,15}$/.test(emailOrPhone);

  if (!isEmail && !isPhone) {
    return new Error("Invalid email or phone number format");
  }

  // Check if the user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: isEmail ? emailOrPhone : undefined },
        { number: isPhone ? emailOrPhone : undefined },
      ],
    },
  });

  if (!existingUser) {
    return new Error("Invalid email or password");
  }

  // Check if the password is correct
  const validPassword = await bcrypt.compare(password, existingUser.password);

  if (!validPassword) {
    return new Error("Invalid password Or Email");
  }

  // Generate JWT token
  const token = jwt.sign({ userId: existingUser.id }, jwtSecret, {
    expiresIn: "7d",
  });

  return {
    userId: existingUser.id,
    token,
  };
};

export const refreshToken = async (
  _: any,
  { Token }: { Token: string },
  { jwtSecret }: Context
) => {
  try {


    // Input validation
    if (!Token || typeof Token !== 'string') {
      throw new Error("Invalid token");
    }

    // Basic token format validation
    if (Token.length > 1000) { // Reasonable JWT length limit
      throw new Error("Invalid token");
    }

    // Verify the refresh token
    const decodedToken = jwt.verify(Token, jwtSecret) as JwtPayload;

    if (!decodedToken.userId) {
      throw new Error("Invalid token");
    }


    // If the Token is valid, generate a new access Token
    const accessToken = jwt.sign({ userId: decodedToken.userId }, jwtSecret, {
      expiresIn: "7d", // "7d"
    });
    // Return the new access Token
    return accessToken;
  } catch (error) {
    // Handle invalid or expired refresh tokens
    return new Error("Invalid or expired refresh Token");
  }
};