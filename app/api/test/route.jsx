import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/dbconnection"

export async function GET() {
    await connectToDB()
    return NextResponse.json({
        success: true,
        message: "Database connected successfully"
    })
}