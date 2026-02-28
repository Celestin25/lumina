import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          
          if (!user.isApproved) {
            throw new Error("Your account is pending review. We will verify you soon.");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            // Strip massive base64 images from the User object BEFORE NextAuth touches it!
            const mutableUser = user as any;
            if (mutableUser.image && mutableUser.image.length > 1000) {
              mutableUser.image = `/api/avatar/${mutableUser.id}`;
            }
            return mutableUser;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
        if (user.image) token.picture = user.image;
      }
      
      // Secondary absolute failsafe for JWT cookie serialization
      if (token.picture && token.picture.length > 1000) {
        token.picture = `/api/avatar/${token.sub}`; 
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
