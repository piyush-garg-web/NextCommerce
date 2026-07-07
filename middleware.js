import { NextResponse } from "next/server"
import { WEBSITE_HOME, WEBSITE_LOGIN } from "./routes/website"
import { jwtVerify } from "jose"

export async function middleware(request) {
    try{
        const pathname=request.nextUrl.pathname
        const hasToken=request.cookies.has('access_token')

        if (!hasToken) {
            if (!pathname.startsWith('/auth')) {
                const url = new URL(WEBSITE_LOGIN, request.nextUrl)
                url.searchParams.set('callback', pathname)
                return NextResponse.redirect(url)
        }

        return NextResponse.next() }

        const access_token=request.cookies.get('access_token').value
        const {payload}=await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY))

        const role=payload.role
        if (pathname.startsWith('/auth')) {
            const callbackUrl = request.nextUrl.searchParams.get('callback')
            const redirectUrl = callbackUrl ? new URL(callbackUrl, request.nextUrl) : new URL(WEBSITE_HOME, request.nextUrl)
            return NextResponse.redirect(redirectUrl)
        }
 
            if (pathname.startsWith('/admin') && role!=='admin') {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
}

 if (pathname.startsWith('/myaccount') && role!=='user') {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
}

        return NextResponse.next()

    } catch(error){

 return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
     }
}

export const config = {
    matcher: ['/myaccount/:path*', '/admin/:path*', '/auth/:path*', '/checkout/:path*', '/orders/:path*', '/order-details/:path*', '/profile/:path*']
}