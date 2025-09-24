import NextAuth from "next-auth";
import type { AuthOptions, Session, SessionStrategy } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60 * 60 * 24,
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  providers: [
    Credentials({
      name: "Aptos Wallet",
      credentials: {
        address: { label: "address", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { address } = credentials as Record<string, string>;
        if (!address) return null;
        return { id: address, address } as { id: string; address: string };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).address) {
        const address = (user as any).address as string;
        await prisma.user.upsert({
          where: { address },
          create: { address },
          update: { lastLoginAt: new Date() },
        });
        token.address = address;
      }
      return token;
    },
    async session({ session, token }) {
      const address = (token as any).address as string | undefined;
      if (address) {
        const dbUser = await prisma.user.findUnique({ where: { address }, select: { role: true } });
        (session as Session & { address?: string; role?: string }).address = address;
        (session as Session & { address?: string; role?: string }).role = dbUser?.role ?? 'USER';
      }
      return session;
    },
  },
  pages: {},
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


