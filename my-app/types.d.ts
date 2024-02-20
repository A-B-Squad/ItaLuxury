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

  interface CreateCategoryInput {
    name: string,
    parentId: any,
  }
  interface UpdateCategoryInput {
    name: string,
  }

  interface CreateCheckoutInput {
    basketId: string,
    status: string,
  }