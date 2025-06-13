import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedRoutes = [
    "/dashboard",
    "/pacientes",
    "/turnos",
    "/estudios",
    "/consultorios",
    "/liquidaciones",
    "/usuarios",
    "/reportes",
  ]

  // Rutas públicas
  const publicRoutes = ["/login", "/debug", "/test-db"]

  const { pathname } = request.nextUrl

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Si es una ruta protegida, verificar autenticación
  if (isProtectedRoute) {
    const userCookie = request.cookies.get("user")?.value

    if (!userCookie) {
      // Redirigir al login si no hay cookie de usuario
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Verificar que la cookie contenga datos válidos
      const userData = JSON.parse(userCookie)
      if (!userData.id || !userData.rol) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      // Cookie malformada, redirigir al login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Si está autenticado y trata de acceder al login, redirigir al dashboard
  if (pathname === "/login") {
    const userCookie = request.cookies.get("user")?.value
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie)
        if (userData.id && userData.rol) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      } catch (error) {
        // Cookie malformada, permitir acceso al login
      }
    }
  }

  // Redirigir la raíz al dashboard si está autenticado, sino al login
  if (pathname === "/") {
    const userCookie = request.cookies.get("user")?.value
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie)
        if (userData.id && userData.rol) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      } catch (error) {
        // Cookie malformada
      }
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
