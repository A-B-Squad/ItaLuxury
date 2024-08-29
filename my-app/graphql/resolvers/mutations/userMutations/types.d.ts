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
  fullName: string;
  password: string;
  role: Role;
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

interface CreateModeratorInput {
  fullName: string;
  password: string;
}
