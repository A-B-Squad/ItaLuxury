import { Context } from "@/pages/api/graphql";
import bcrypt from "bcryptjs";

export const createModerator = async (
  _: any,
  { input, adminId }: { adminId: string; input: CreateModeratorInput },
  { prisma }: Context
) => {
  try {
    const { fullName, password } = input;

    // Check if the email is already in use
    const existingAdmin = await prisma.user.findFirst({
      where: { fullName },
    });

    console.log(existingAdmin);

    // Check if the user invoking the mutation is authorized

    if (existingAdmin) {
      return new Error("Email address is already in use");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the moderator in the database
    await prisma.admin.create({
      data: {
        fullName,
        password: hashedPassword,
        role: "MODERATOR",
      },
    });

    return "Moderator created";
  } catch (error) {
    // Handle errors
    console.log(error);
    
    console.error("Error creating moderator:", error);
    return new Error("An error occurred while creating the moderator");
  }
};
