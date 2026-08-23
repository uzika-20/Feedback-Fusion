import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/auth/sign-in", // Fixed path here
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
   async jwt({ token, user, trigger, session }) {
  if (user) {
    token.id = user.id;
    token.role = (user as any).role;
    token.name = user.name;
    token.email = user.email;
  }

  // This runs when you call the client-side update() function
  if (trigger === "update" && session) {
    if (session.name) token.name = session.name;
    if (session.email) token.email = session.email;
  }

  return token;
},
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    (session.user as any).role = token.role;
    session.user.name = token.name as string;
    session.user.email = token.email as string;
  }
  return session;
},
  }, // closes callbacks
}); // closes NextAuth({...})}