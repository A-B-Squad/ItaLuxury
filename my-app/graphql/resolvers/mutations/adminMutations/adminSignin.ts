import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "@/pages/api/graphql";


export const adminSignIn = async (
  _: any,
  { input }: { input: SignInAdminInput },
  { prisma, jwtSecret, res }: Context
): Promise<string> => {
  const { fullName, password, role } = input;

  try {
    // Check if the user exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { fullName, role },
    });

    if (!existingAdmin) {
      throw new Error("Invalid credentials");
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, existingAdmin.password);

    if (!validPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT token with 5 hour expiration
    const token = jwt.sign({ userId: existingAdmin.id,role:existingAdmin.role }, jwtSecret, {
      expiresIn: "5h",
    });

    // Calculate expiration date (5 hours from now)
    const expirationDate = new Date(Date.now() + 5 * 60 * 60 * 1000);

    // Set the cookie with a domain that covers both the admin and user projects
    res.setHeader(
      "Set-Cookie",
      `AdminToken=${token}; Path=/; SameSite=Strict; Secure; Expires=${expirationDate.toUTCString()}`
    );

    return token;
  } catch (error) {
    console.error("Admin sign-in error:", error);
    throw new Error("An error occurred during sign-in");
  }
};