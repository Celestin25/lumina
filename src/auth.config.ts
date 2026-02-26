import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no Prisma, no bcrypt
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");

      if (isAdminRoute) {
        if (!isLoggedIn) return false; // redirect to signIn page
        const role = (auth?.user as any)?.role;
        if (role !== "ADMIN") return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [], // providers are added in auth.ts (Node.js only)
} satisfies NextAuthConfig;
