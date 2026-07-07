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

                const monthlySales= await OrderModel.aggregate([
                    {
                        $match:{
                            deletedAt:null,
                            status:{$in:['processing','shipped','delivered']}
                        }
                    },
                    {
                        $group:{
                            _id:{
                                year:{$year:"$createdAt"},
                                month:{$month:"$createdAt"},
                            },
                            totalSales:{$sum:'$totalAmount'}
                        }
                    },
                    {
                        $sort:{'_id.year':1,'_id.month':1}
                    }
                ])

                return response (true,200,'Data Found',monthlySales)

            } catch(error) {
        return catchError(error)
    }
}