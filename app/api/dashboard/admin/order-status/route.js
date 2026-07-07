import { isAuthenticated } from "@/lib/authentication";
import { connectToDB } from "@/lib/dbConnection";
import { catchError, response } from "@/lib/helperFunctions";
import OrderModel from "@/models/Order.model";

export async function GET() {
    try {
  const auth = await isAuthenticated('admin')
                if (!auth.isAuth) {
                    return response(false, 403, "Unauthorized")
                }
                await connectToDB()

                const orderStatus= await OrderModel.aggregate([
                    {
                        $match:{
                            deletedAt:null,
                        }
                    },
                    {
                        $group:{
                            _id: "$status",
                            count : {$sum :1},
                        }
                    },
                    {
                        $sort:{count:1}
                    }
                ])

                return response (true,200,'Data Found',orderStatus)

            } catch(error) {
        return catchError(error)
    }
}