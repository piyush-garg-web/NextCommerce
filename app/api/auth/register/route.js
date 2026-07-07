import { emailVerificationLink } from "@/email/emailVerificationLink"
import { connectToDB } from '@/lib/dbConnection.js'
import UserModel from "@/models/UserModel"
import { response, catchError } from '@/lib/helperFunctions.js'
import { zschema } from '@/lib/zodSchema.js'
import { SignJWT } from "jose"
import { sendMail } from "@/lib/sendMail"

export async function POST(request) {
    try {
        await connectToDB()
        const validationSchema = zschema.pick({
            name: true, email: true, password: true
        })

        const payload = await request.json()
        const validatedData = validationSchema.safeParse(payload)
        if (!validatedData.success) {
            return response(false, 401, "Invalid or missing input fields", validatedData.error)
        }

        const { name, email, password } = validatedData.data

        const checkUser = await UserModel.exists({ email })

        if (checkUser) {
            return response(true, 409, "User with this email already exists")
        }


        const newRegistration = new UserModel({ name, email, password })
        await newRegistration.save()


        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT({ userId: newRegistration._id.toString() })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(secret)

 await sendMail("Verify your email", email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifyemail/${token}`));

       
        return response(true, 200, "Registratoon success, pls verify ur email address")

    } catch (error) {
        return catchError(error, "Error occurred during user registration")
    }
}