import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
