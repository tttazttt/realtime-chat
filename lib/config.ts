import prisma from "@/lib/prismaClient";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email as string,
            name: user.name,
            image: user.image,
          },
        });
      }
      return true;
    },
    async jwt({ token }) {
      if (!token.email) return token;

      const existingUser = await prisma.user.findUnique({
        where: { email: token.email },
        select: { id: true, name: true, image: true, email: true },
      });

      if (existingUser) {
        token.id = existingUser.id;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.image = existingUser.image;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name ?? "defaultName";
      session.user.email = token.email;
      session.user.image = token.image as string;

      return session;
    },
  },
};
