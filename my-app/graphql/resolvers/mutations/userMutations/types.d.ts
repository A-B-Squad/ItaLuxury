enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  number: string;
}
interface SignInAdminInput {
  fullName: string;
  password: string;
  role:Role
}

interface SignInInput {
  emailOrPhone:string
  password: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthPayload {
  token: string;
  userId: User;
}

interface CreateModeratorInput {
  fullName: string;
  password: string;
}
