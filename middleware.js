import { NextResponse } from "next/server"
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/website"
import { jwtVerify } from "jose"
import { ADMIN_DASHBOARD } from "./routes/adminpanel"

export async function middleware(request) {
    try{
        const pathname=request.nextUrl.pathname
        const hasToken=request.cookies.has('access_token')

        if (!hasToken) {
            if (!pathname.startsWith('/auth')) {
                return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl))
        }

        return NextResponse.next() }

        const access_token=request.cookies.get('access_token').value
        const {payload}=await jwtVerify(access_token, new TextEncoder().encode(process.env.SECRET_KEY))

        const role=payload.role
        if (pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL(role==='admin' ? ADMIN_DASHBOARD:USER_DASHBOARD, request.nextUrl)) }
 
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
    matcher: ['/myaccount/:path*', '/admin/:path*', '/auth/:path*']
}