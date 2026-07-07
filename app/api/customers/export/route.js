import { isAuthenticated } from "@/lib/authentication";
import { connectToDB } from '@/lib/dbConnection.js';
import { catchError,response } from '@/lib/helperFunctions.js';
import UserModel from "@/models/UserModel";



export async function GET(request) {
    try {
        const auth= await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false,403,'Unauthorized')
        }
        await connectToDB()
   
        const filter = {
            deletedAt:null
        }

        const getCustomers=await UserModel.find(filter).sort({createdAt:-1}).lean()
        
        if (!getCustomers) {
            return response (false,404,'Collection Empty')
        }

        return response (true,200,'Data Found',getCustomers)
    } catch (error) {
        return catchError(error)
    }
}