import { connectToDB } from "@/lib/dbConnection";
import { catchError } from "@/lib/helperFunctions";
import UserModel from "@/models/user.model";
import z from "zod";
import { response } from "@/lib/helperFunctions";
import { zschema } from "@/lib/zodSchema";  



export async function PUT(request) {
    try {   
        await connectToDB();
        const payload = await request.json();
        const validationSchema = zschema.pick({ email: true, password: true });

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response(false, 401, "Invalid or missing input fields", validatedData.error);
        }

        const {email,password}=validatedData.data;

        const getUser = await UserModel.findOne({ deletedAt: null, email}).select('+password');

        if (!getUser) {
            return response(false, 404, "User not found");
        } 

        getUser.password = password;
        await getUser.save();

        return response(true, 200, "Password updated successfully");
    }

    catch (error) {
    return catchError(error);
    }
}