import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const authToken = request.cookies.get("auth_session")?.value
    console.log("toekn ", authToken)
    const path = request.nextUrl.pathname
    console.log("path", path)
    const authPath = path === "/logIn" || path === "/register" || path === "/email" || path === "/reset"
    //  Case 1: User has token
    if (authToken) {
        if (authPath) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    //  Case 2: No token
    if (!authToken) {
        if (!authPath) {
            return NextResponse.redirect(new URL("/logIn",
                request.url));
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/', '/logIn', '/register', '/reset', '/email']
}