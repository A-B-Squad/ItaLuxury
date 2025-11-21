import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "@apollo/client";

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
  { prisma, jwtSecret, cookies }: Context
) => {
  const { fullName, email, password, number } = input;

  // Check if the email is already in use
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUserByEmail) {
    throw new Error("Email address is already in use");
  }

  // Check if the number is already in use
  const existingUserByNumber = await prisma.user.findFirst({
    where: { number },
  });
  if (existingUserByNumber) {
    throw new Error("Phone number is already in use");
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
  const token = jwt.sign({ userId: newUser.id }, jwtSecret,{
     expiresIn: "7d", 
  });


  return {
    userId: newUser.id,
    token,
  };
};