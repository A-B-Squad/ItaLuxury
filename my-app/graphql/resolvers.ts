import { Context } from "../pages/api/graphql";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  number: string;
}

interface SignInInput {
  email: string;
  password: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

export const resolvers = {
  Query: {
    products(){
      return []
     }
  },

    Mutation: {

    },
};
