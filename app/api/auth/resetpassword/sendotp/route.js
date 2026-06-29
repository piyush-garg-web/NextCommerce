import { connectToDB } from "@/lib/dbconnection";
import { catchError } from "@/lib/helperfunctions";
import UserModel from "@/models/user.model";
import z from "zod";
import { response } from "@/lib/helperfunctions";
import { zschema } from "@/lib/zodschema";  
import OTPModel from "@/models/otp.model";
import { generateOTP } from "@/lib/helperfunctions";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpemail";


export async function POST(request) {
    try{
await connectToDB();
const payload=await request.json();

const validationSchema=zschema.pick({email:true});

const validatedData=validationSchema.safeParse(payload);

if(!validatedData.success){
    return response (false,401,"invalid or missing input fields",validatedData.error);
    }

    const{email} =validatedData.data;
    const getUser=await UserModel.findOne({deletedAt:null,email}).lean();

    if(!getUser){
        return response (false,404,"user not found");
    }

     await OTPModel.deleteMany({ email });
    
                            const otp = generateOTP();
                            const newOtpData = new OTPModel({ email, otp});
                            await newOtpData.save();
    
                            const otpSendStatus = await sendMail("Your OTP Code", email, otpEmail(otp));
    
                            if (!otpSendStatus.success) {
                                return response(false, 400, "Failed to send OTP email. Please try again later.");}
        return response(true, 200, "Please Verify your account"); }



    catch(error){
        catchError(error);}
    }