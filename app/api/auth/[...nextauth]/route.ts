import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [Credentials({
    name: "credentials",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(creds) {
      if (!creds?.email || !creds?.password) return null;
      const admin = await prisma.businessAdmin.findUnique({ where: { email: String(creds.email) } });
      if (!admin) return null;
      const ok = await bcrypt.compare(String(creds.password), admin.passwordHash);
      if (!ok) return null;
      return { id: admin.id, email: admin.email, name: admin.name || admin.email };
    },
  })],
  callbacks: {
    async jwt({ token, user }) { if (user) token.id = user.id; return token; },
    async session({ session, token }) { if (session.user) (session.user as any).id = token.id; return session; },
  },
});
export const { GET, POST } = handlers;