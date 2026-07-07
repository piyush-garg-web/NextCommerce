import { connectToDB } from '@/lib/dbConnection.js';
import UserModel from "@/models/UserModel";
import { response, catchError } from '@/lib/helperFunctions.js';
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";



export async function POST(request) {
  try {
    await connectToDB();
    const {token} = await request.json();

 if (!token) {
      return response(false,400,'Missing token');
    }

     const secret = new TextEncoder().encode(process.env.SECRET_KEY)

    const decoded = await jwtVerify(token,secret);
    const userId = decoded.payload.userId;

const user = await UserModel.findById(userId);

    if (!user){
      return response(false,404,'User not found');
    }

    user.isEmailVerified = true;
    await user.save();

    // Generate JWT token for auto-login
    const loggedInUserData = {
      _id: user._id.toString(),
      name: user.name,
      role: user.role,
      avatar: user.avatar
    };

    const tokenSecret = new TextEncoder().encode(process.env.SECRET_KEY);
    const accessToken = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(tokenSecret);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: accessToken,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response(true,200,'Email verified successfully', loggedInUserData);

  } catch (error) {
    return catchError(error)
  }
}
