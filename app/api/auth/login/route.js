import OTPModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { connectToDB } from "@/lib/dbConnection";
import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { sendMail } from "@/lib/sendMail";
import { SignJWT } from "jose";
import { z } from "zod";
import { response, catchError, generateOTP } from "@/lib/helperFunctions";  
import { zschema } from "@/lib/zodSchema";


export async function POST(request) {
    try {
        await connectToDB();
        const payload = await request.json();
        const validationSchema = zschema.pick({
            email: true}).extend({
                password:z.string()
            })

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
               return response(false, 401, "Invalid or missing input fields", validatedData.error);}

               const { email, password } = validatedData.data;

               const getUser = await UserModel.findOne({ deletedAt:null , email }).select("+password");

               if (!getUser) {
                return response(false, 404, "Invalid login credentials");}

                if (!getUser.isEmailVerified) {   const secret = new TextEncoder().encode(process.env.SECRET_KEY)
                        const token = await new SignJWT({ userId: getUser._id.toString() })
                            .setProtectedHeader({ alg: "HS256" })
                            .setIssuedAt()
                            .setExpirationTime("1h")
                            .sign(secret)
                
                 await sendMail("Verify your email", email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifyemail/${token}`));

                    return response(false, 401, "Please verify your email address to login");
                }

                const isPasswordVerified = await getUser.comparePassword(password);

                if (!isPasswordVerified) {
                    return response(false, 400, "Invalid login credentials");}


                     await OTPModel.deleteMany({ email });

                     const otp = generateOTP();

                     const newOtpData = new OTPModel({ email, otp});
                        await newOtpData.save();

                        const otpEmailStatus = await sendMail("Your OTP Code", email, otpEmail(otp));

                        if (!otpEmailStatus.success) {
                            return response(false, 400, "Failed to send OTP email. Please try again later.");}

        return response(true, 200, "OTP sent to your email successfully", { email } );

        
    } catch (error) {
        return catchError(error);}}