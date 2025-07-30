import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Call the backend API for authentication
          const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
          console.log('NextAuth: Attempting to authenticate with backend at:', backendUrl);
          
          const response = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.error('Backend authentication failed:', response.status);
            return null;
          }

          const data = await response.json();
          
          if (data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.email.split('@')[0], // Use email prefix as name
              accessToken: data.token,
            };
          }
          
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});

export { handler as GET, handler as POST }; 