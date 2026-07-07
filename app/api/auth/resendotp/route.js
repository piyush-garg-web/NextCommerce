import { connectToDB } from '@/lib/dbConnection.js';
import { response, catchError } from '@/lib/helperFunctions.js';
import { zschema } from '@/lib/zodSchema.js';  
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { generateOTP } from '@/lib/helperFunctions.js';
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";





export async function POST(request) {
try{
    await connectToDB();
    const payload = await request.json();
    const validationSchema =  zschema.pick({ email: true });
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
           return response(false, 401, "Invalid or missing input fields", validatedData.error);}

           const {email} = validatedData.data;

           const getUser = await UserModel.findOne({email });

                if (!getUser) {
                    return response(false, 404, "User not found");}

                    
                        await OTPModel.deleteMany({ email });

                        const otp = generateOTP();
                        const newOtpData = new OTPModel({ email, otp});
                        await newOtpData.save();

                        const otpSendStatus = await sendMail("Your OTP Code", email, otpEmail(otp));

                        if (!otpSendStatus.success) {
                            return response(false, 400, "Failed to send OTP email. Please try again later.");}
    return response(true, 200, "OTP resent to your email successfully", );

}
catch(error){
return catchError(error)
}}