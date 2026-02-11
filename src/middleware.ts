import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isInternal = req.nextUrl.pathname.startsWith("/admin");
  const isLoggedIn = !!req.auth;

  if (isInternal) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    
    // Check for ADMIN role
    // Note: TypeScript might complain if we don't extend the type, 
    // but at runtime req.auth.user.role will exist if we set it in auth.ts
    const userRole = (req.auth.user as any)?.role;
    
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }
  
  return NextResponse.next();
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
