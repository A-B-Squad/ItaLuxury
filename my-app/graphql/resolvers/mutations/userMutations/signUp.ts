import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "../../../../pages/api/graphql";

function generateProfessionalId(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const signUp = async (
  _: any,
  { input }: { input: SignUpInput },
  { prisma, jwtSecret, res }: Context
) => {
  const { fullName, email, password, number } = input;

  // Check if the email is already in use
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUserByEmail) {
    return new Error("Email address is already in use");
  }

  // Check if the number is already in use
  const existingUserByNumber = await prisma.user.findFirst({
    where: { number },
  });
  if (existingUserByNumber) {
    return new Error("Phone number is already in use");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a unique professional ID
  let professionalId;
  let isUnique = false;

  while (!isUnique) {
    professionalId = generateProfessionalId(6);
    const existingProfessionalId = await prisma.user.findUnique({
      where: { id: professionalId },
    });
    if (!existingProfessionalId) {
      isUnique = true;
    }
  }

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      id: professionalId,
      fullName,
      email,
      password: hashedPassword,
      number,
      role: "USER",
    },
  });

  // Generate JWT token
  const token = jwt.sign({ userId: newUser.id }, jwtSecret);

  // Determine the domain and secure settings based on environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  const domain = isDevelopment ? 'localhost' : 'ita-luxury.com';
  const secureFlag = isDevelopment ? '' : 'Secure;';

  // Set the cookie with environment-specific settings
  res.setHeader(
    "Set-Cookie",
    `Token=${token}; Path=/; Domain=${domain}; SameSite=Strict; ${secureFlag} `
  );


  return {
    user: newUser,
    token,
  };
};