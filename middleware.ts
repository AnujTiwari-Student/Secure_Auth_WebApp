// import { auth } from "./lib/auth"
import authConfig from "./lib/auth.config";
import NextAuth from "next-auth";
import {
    publicRoutes,
    protectedRoutes,
    apiPrefix,
    graphqlApiPrefix,
    redirectUrl
} from "./path_routes/route"
import { NextRequest, NextResponse } from "next/server";

console.log("Middleware loaded with authConfig", authConfig)

const { auth } = NextAuth(authConfig)
export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    console.log("User is logged in:", isLoggedIn);
    console.log("Route", nextUrl.pathname); 

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiPrefix) || nextUrl.pathname.startsWith(graphqlApiPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || publicRoutes.some(route => nextUrl.pathname.startsWith(route));
    const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname) || protectedRoutes.some(route => nextUrl.pathname.startsWith(route));

    if( isApiAuthRoute ) {
        return NextResponse.next();
    }

    if( isPublicRoute && isLoggedIn && ["/login", "/signup"].includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL(redirectUrl, nextUrl));
    }

    if( isProtectedRoute && !isLoggedIn ) {
        console.log("Redirecting to login for public route");
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    return NextResponse.next();

})
 
export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)', '/api/graphql'],
}

export async function validateRequest(request: NextRequest) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const contentType = request.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return new Response('Unsupported Media Type', { status: 415 });
  }

  return null; // no error
}