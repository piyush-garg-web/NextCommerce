import { NextResponse } from "next/server"
import { WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER } from "./routes/website"
import { jwtVerify } from "jose"

export async function middleware(request) {
    try {
        const pathname = request.nextUrl.pathname
        const hasToken = request.cookies.has('access_token')

        console.log('[MIDDLEWARE] Pathname:', pathname)
        console.log('[MIDDLEWARE] Has access token:', hasToken)

        // Protect admin routes
        if (pathname.startsWith('/admin')) {
            if (!hasToken) {
                const url = new URL(WEBSITE_REGISTER, request.nextUrl)
                url.searchParams.set('callback', pathname)
                console.log('[MIDDLEWARE] No token, redirect to register:', url.toString())
                return NextResponse.redirect(url)
            }

            const access_token = request.cookies.get('access_token').value
            console.log('[MIDDLEWARE] Got access token')
            
            const secret = new TextEncoder().encode(process.env.SECRET_KEY)
            const { payload } = await jwtVerify(access_token, secret)

            console.log('[MIDDLEWARE] Token payload:', payload)

            const role = payload.role
            console.log('[MIDDLEWARE] User role:', role)

            if (role !== 'admin') {
                console.log('[MIDDLEWARE] Not admin, redirect to home')
                return NextResponse.redirect(new URL(WEBSITE_HOME, request.nextUrl))
            }
            return NextResponse.next()
        }

        if (!hasToken) {
            if (!pathname.startsWith('/auth')) {
                const url = new URL(WEBSITE_LOGIN, request.nextUrl)
                url.searchParams.set('callback', pathname)
                console.log('[MIDDLEWARE] No token, redirect to login:', url.toString())
                return NextResponse.redirect(url)
            }
            return NextResponse.next()
        }

        const access_token = request.cookies.get('access_token').value
        console.log('[MIDDLEWARE] Got access token')
        
        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const { payload } = await jwtVerify(access_token, secret)

        console.log('[MIDDLEWARE] Token payload:', payload)

        const role = payload.role
        console.log('[MIDDLEWARE] User role:', role)

        if (pathname.startsWith('/auth')) {
            const callbackUrl = request.nextUrl.searchParams.get('callback')
            const redirectUrl = callbackUrl ? new URL(callbackUrl, request.nextUrl) : new URL(WEBSITE_HOME, request.nextUrl)
            return NextResponse.redirect(redirectUrl)
        }

        if (pathname.startsWith('/myaccount') && role !== 'user') {
            console.log('[MIDDLEWARE] Not user, redirecting to login:', WEBSITE_LOGIN)
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }

        return NextResponse.next()

    } catch (error) {
        console.error('[MIDDLEWARE] Error:', error)
        // If error on admin route, redirect to register
        const pathname = request.nextUrl.pathname
        if (pathname.startsWith('/admin')) {
            const url = new URL(WEBSITE_REGISTER, request.nextUrl)
            url.searchParams.set('callback', pathname)
            return NextResponse.redirect(url)
        }
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
    }
}

export const config = {
    matcher: ['/myaccount/:path*', '/admin/:path*', '/auth/:path*', '/checkout/:path*', '/orders/:path*', '/order-details/:path*', '/profile/:path*']
}