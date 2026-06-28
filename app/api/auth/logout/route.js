import { connectToDB } from "@/lib/dbconnection";
import { catchError, response } from "@/lib/helperfunctions";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        await connectToDB()
        const cookieStore=await cookies()
        cookieStore.delete('access_token')
        return response (true,200,"Logout Successful")
    } catch(error) {
    catchError(error) 
} }