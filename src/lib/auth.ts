import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";

const secret = process.env.NEXTAUTH_SECRET;
// Only enforce at runtime so `next build` succeeds on Vercel (env vars are set in dashboard, not at build time)
const isBuild = process.env.NEXT_PHASE === "phase-production-build";
if (!secret && process.env.NODE_ENV === "production" && !isBuild) {
  throw new Error("NEXTAUTH_SECRET must be set in production (e.g. openssl rand -base64 32)");
}

export const authOptions: NextAuthOptions = {
  secret: secret || (process.env.NODE_ENV === "development" ? "knowledgeshare-dev-secret-change-in-production" : undefined),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/auth/signin" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name ?? credentials.email.split("@")[0],
            },
          });
        }
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
};
