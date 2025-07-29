import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      preferences: {
        categories: string[];
        darkMode: boolean;
        favorites: any[];
      };
    };
  }

  interface User {
    id: string;
    email: string;
    preferences: {
      categories: string[];
      darkMode: boolean;
      favorites: any[];
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    preferences?: {
      categories: string[];
      darkMode: boolean;
      favorites: any[];
    };
  }
} 