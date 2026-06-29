import { isAuthenticated } from "@/lib/authentication";
import { connectToDB } from "@/lib/dbconnection";
import { catchError, response } from "@/lib/helperfunctions";
import OrderModel from "@/models/Order.model";

export async function GET() {
    try {
  const auth = await isAuthenticated('admin')
                if (!auth.isAuth) {
                    return response(false, 403, "Unauthorized")
                }
                await connectToDB()

     const latestOrder=await OrderModel.find ({deletedAt:null}).sort({createdAt:-1}).limit(10).lean()
                return response (true,200,'Data Found',latestOrder)

            } catch(error) {
        return catchError(error)
    }
}