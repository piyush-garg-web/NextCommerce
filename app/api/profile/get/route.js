import { isAuthenticated } from "@/lib/authentication";
import { connectToDB } from "@/lib/dbconnection";
import { catchError, response } from "@/lib/helperfunctions";
import UserModel from "@/models/user.model";

export async function GET() {
    try{
await connectToDB()
  const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response (false,402,'Unauthorized')
        }

const userId=auth.userId
const user=await UserModel.findById(userId).lean()

return response (true,200,'User Data',user)


    } catch (error) {
        return catchError(error)
    }
}