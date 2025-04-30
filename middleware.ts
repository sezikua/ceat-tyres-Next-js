import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Тут можна додати логіку для перенаправлень або інших обробок запитів
  // Наразі просто пропускаємо всі запити без змін
  return NextResponse.next()
}

// Вказуємо, для яких шляхів застосовувати middleware
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
