// Define types for favorite items
interface FavoriteItem {
  id?: string | number;
  type?: 'movie' | 'news';
  title: string;
  description: string;
  url: string;
  source?: {
    name: string;
  };
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      preferences: {
        categories: string[];
        darkMode: boolean;
        favorites: FavoriteItem[];
      };
    };
  }

  interface User {
    id: string;
    email: string;
    preferences: {
      categories: string[];
      darkMode: boolean;
      favorites: FavoriteItem[];
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
      favorites: FavoriteItem[];
    };
  }
} 