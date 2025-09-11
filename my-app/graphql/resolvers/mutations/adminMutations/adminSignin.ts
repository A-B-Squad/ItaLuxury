import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "@apollo/client";


export const adminSignIn = async (
  _: any,
  { input }: { input: SignInAdminInput },
  { prisma, jwtSecret }: Context
): Promise<string> => {
  const { fullName, password, role } = input;

  try {

    if (!fullName || !password || !role) {
      throw new Error("Invalid credentials");
    }

    const allowedRoles = ['ADMIN', 'MODERATOR'];
    if (!allowedRoles.includes(role)) {
      throw new Error("Invalid credentials");
    }

    if (fullName.trim().length > 100) {
      throw new Error("Invalid credentials");
    }
    // Check if the user exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        fullName: fullName,
        role: role as Role
      },
    });

    if (!existingAdmin) {
      throw new Error("Invalid credentials");
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, existingAdmin.password);

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token with 7 days expiration
    const token = jwt.sign({ userId: existingAdmin.id, role: existingAdmin.role }, jwtSecret, {
      expiresIn: "7d",
    });
  
    return token;
  } catch (error) {
    console.error("Admin sign-in error:", error);
    throw new Error("An error occurred during sign-in");
  }
};