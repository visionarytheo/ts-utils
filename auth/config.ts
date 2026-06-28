import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
    // maxAge: 15 * 60, // 15 minutes
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/",
    error: "/error-page",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.user_id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email ?? "";
        token.image = user.image ?? "";
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.user_id = token.user_id;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const isLoggedIn = !!user;

      const userRole = user?.role;
      console.log({ userRole });

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        if (userRole !== "ADMIN" && userRole !== "MANAGER") {
          console.log(`User: ${userRole} is not an admin`);
          return false;
        }

        return true;
      }

      if (isOnDashboard) {
        if (!isLoggedIn) {
          return false;
        }

        return true; // Allow access to other dashboard routes for logged-in users
      }

      // Redirect logged-in users to dashboard for non-dashboard, non-auth routes
      if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
