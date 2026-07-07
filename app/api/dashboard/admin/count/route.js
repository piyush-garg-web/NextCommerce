import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from '@/lib/dbConnection.js'
import { catchError, response } from '@/lib/helperFunctions.js'
import CategoryModel from "@/models/Category.model"
import OrderModel from "@/models/Order.model"
import ProductModel from "@/models/Product.model"
import UserModel from "@/models/UserModel"

export async function GET() {
    try {
             const auth = await isAuthenticated('admin')
                if (!auth.isAuth) {
                    return response(false, 403, "Unauthorized")
                }
                await connectToDB()

const [category,product,customer,order] = await Promise.all([CategoryModel.countDocuments({deletedAt:null}),
    ProductModel.countDocuments({deletedAt:null}),
    UserModel.countDocuments({deletedAt:null}),
 OrderModel.countDocuments({deletedAt:null}),
])

return response (true,200,'Dashboard count',{category,product,customer,order})

    } catch (error) {
        return catchError(error)
    }
}
    