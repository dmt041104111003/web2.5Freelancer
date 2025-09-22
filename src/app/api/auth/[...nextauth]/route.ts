import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
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
      if (user) {
        const u = user as { address?: string };
        if (u.address) {
          (token as { address?: string }).address = u.address;
          token.sub = u.address;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Keep default session shape; address is in token if needed
      return session;
    },
  },
  pages: {},
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler = NextAuth(authOptions) as unknown as (
  req: Request,
  ctx: { params: { nextauth: string[] } }
) => Promise<Response>;

export async function GET(request: Request, context: { params: { nextauth: string[] } }) {
  return authHandler(request, context);
}

export const POST = authHandler;


