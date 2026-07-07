import { connectToDB } from "@/lib/dbConnection";
import { response, catchError } from "@/lib/helperFunctions";
import { zschema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";





export async function POST(request) {
  try {
    await connectToDB();
    const payload = await request.json();
    const validationSchema =  zschema.pick({ otp: true, email: true });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
           return response(false, 401, "Invalid or missing input fields", validatedData.error);}

           const { email, otp } = validatedData.data;

              const getOtpData =  await OTPModel.findOne({ email, otp });

                if (!getOtpData) {
                    return response(false, 404, "Invalid or Expired OTP code"); }

                    const getUser = await UserModel.findOne({ deletedAt:null, email }).lean();

if (!getUser) {
                return response(false, 404, "User not found");}

                const loggedInUserData = {
                    _id: getUser._id.toString(),
                    name: getUser.name,
                    role: getUser.role,
                    avatar: getUser.avatar
                }

const secret = new TextEncoder().encode(process.env.SECRET_KEY)
    const token = await new SignJWT(loggedInUserData).setIssuedAt()
        .setExpirationTime("24h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

        const cookieStore=await cookies();
        cookieStore.set({
            name:'access_token',
            value:token,
            httpOnly:process.env.NODE_ENV === 'production' ,
            path:'/',
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',});

            await getOtpData.deleteOne();

    return response(true,200,'OTP verified successfully',loggedInUserData);
   
  } catch (error) {
    return catchError(error)
  }
}
