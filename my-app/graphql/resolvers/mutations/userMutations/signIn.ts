import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Context } from "@/pages/api/graphql";

export const signIn = async (
  _: any,
  { input }: { input: SignInInput },
  { prisma, jwtSecret, res }: Context
) => {
  const { emailOrPhone, password } = input;

  // Check if the input is an email or a phone number
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);
  const isPhone = /^[0-9]{8}$/.test(emailOrPhone);

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
  console.log(validPassword);

  if (!validPassword) {
    return new Error("Invalid password Or Email");
  }

  // Generate JWT token
  const token = jwt.sign({ userId: existingUser.id }, jwtSecret, {
    expiresIn: "30d",
  });

  // Calculate expiration date (30 days from now)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);

  // Set the cookie
  res.setHeader(
    "Set-Cookie",
    `Token=${token}; Path=/; Domain=ita-luxury.com;SameSite=Strict; Secure; Expires=${expirationDate.toUTCString()}`
  );
  return {
    user: existingUser,
    token,
  };
};

export const refreshToken = async (
  _: any,
  { Token }: { Token: string },
  { jwtSecret, res }: Context
) => {
  try {
    // Verify the refresh token
    const decodedToken = jwt.verify(Token, jwtSecret) as JwtPayload;

    // If the Token is valid, generate a new access Token
    const accessToken = jwt.sign({ userId: decodedToken.userId }, jwtSecret, {
      expiresIn: "1h",
    });

    // Set the new access Token in the cookie
    res.setHeader(
      "Set-Cookie",
      `Token=${accessToken}; Path=/; SameSite=Strict; Secure`
    );

    // Return the new access Token
    return accessToken;
  } catch (error) {
    // Handle invalid or expired refresh tokens
    return new Error("Invalid or expired refresh Token");
  }
};
