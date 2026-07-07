import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import UserModel from "@/models/UserModel";
import { connectToDB } from "@/lib/dbConnection";

export async function GET() {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) {
      return NextResponse.json({ success: false, message: "No session found" });
    }
    const accessToken = cookieStore.get("access_token").value;
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    
    await connectToDB();
    const user = await UserModel.findById(payload._id).select('-password');
    
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }
    
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
