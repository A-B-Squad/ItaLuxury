import { Authorization } from "../userMutations/authorization";
import { Context } from "@/pages/api/graphql";

export const createModerator = async (
  _: any,
  { input, userId }: { userId: string, input: CreateModeratorInput },
  { prisma }: Context
) => {
  try {
    // Check if the user invoking the mutation is authorized
    const isAuthorized = await Authorization(_, { userId }, prisma);

    if (!isAuthorized) {
      return new Error('User is not authorized to create a moderator');
    }

    const { fullName, email, password, number } = input;
    // Create the moderator in the database
    const moderator = await prisma.user.create({
      data: {
        fullName,
        email,
        password,
        number,
        role: 'MODERATOR',
      },
    });

    return moderator;
  } catch (error) {
    // Handle errors
    console.error("Error creating moderator:", error);
    return error
  }
};
