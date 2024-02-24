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

  interface CreateModeratorInput {
    fullName: string
    email: string
    password: string
    number: string
  }