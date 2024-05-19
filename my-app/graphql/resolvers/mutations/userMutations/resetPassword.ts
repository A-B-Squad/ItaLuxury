import bcrypt from 'bcryptjs';
import { Context } from "../../../../pages/api/graphql";

export const resetPassword = async (
  _: any,
  { password, id }: { password: string, id: string },
  { prisma }: Context
) => {
  try {
    // Validate the token and find the user associated with it
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return "Invalid or expired token!";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return "Password reset successfully!";
  } catch (error) {
    console.error("Error in resetPassword function:", error);
    return "An error occurred, please try again later.";
  }
};
