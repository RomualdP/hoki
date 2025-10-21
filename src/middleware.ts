import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware - Protection des routes
 *
 * Vérifie l'authentification de l'utilisateur pour toutes les routes.
 * Redirige vers /login si non authentifié (sauf routes publiques).
 */

/**
 * Routes publiques accessibles sans authentification
 */
const PUBLIC_ROUTES = ["/login", "/signup"];

/**
 * Vérifie si une route est publique
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Vérifie si l'utilisateur est authentifié via le token JWT dans les cookies
 */
function isAuthenticated(request: NextRequest): boolean {
  // Vérifier la présence du token d'authentification (httpOnly cookie)
  const token = request.cookies.get("accessToken")?.value;
  return !!token;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la route est publique, laisser passer
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Vérifier l'authentification
  if (!isAuthenticated(request)) {
    // Rediriger vers /login avec l'URL de retour
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Utilisateur authentifié, laisser passer
  return NextResponse.next();
}

/**
 * Configuration du matcher
 * Définit les routes sur lesquelles le middleware s'applique
 */
export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
