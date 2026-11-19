import { auth } from "@/app/api/auth/[...nextauth]/route";
export default auth((req) => {
  const isAuth = !!req.auth;
  const isDash = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/settings") || req.nextUrl.pathname.startsWith("/links");
  if (isDash && !isAuth) return Response.redirect(new URL("/login", req.url));
});
export const config = { matcher: ["/dashboard/:path*", "/settings/:path*", "/links/:path*"] };