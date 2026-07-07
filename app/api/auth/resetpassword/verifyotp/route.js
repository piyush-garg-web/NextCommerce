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

                

            await getOtpData.deleteOne();

    return response(true,200,'OTP verified successfully');
   
  } catch (error) {
    return catchError(error)
  }
}
