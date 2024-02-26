import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "../../../../pages/api/graphql";


export const signUp = async (_: any, { input }: { input: SignUpInput }, { prisma, jwtSecret }: Context) => {
  const { fullName, email, password, number } = input;
  // Check if the email is already in use
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return new Error("Email address is already in use");
  }

  // hash password
  const hashedPassword = await bcrypt.hashSync(password, 10);

  // create new user
  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      number,
      role: 'USER'
    }
  })

  // Generate JWT token
  const token = jwt.sign({ userId: newUser.id }, jwtSecret);

  return {
    user: newUser,
    token
  };
}


