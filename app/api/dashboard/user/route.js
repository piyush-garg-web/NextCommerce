import { isAuthenticated } from "@/lib/authentication";
import { connectToDB } from '@/lib/dbConnection.js';
import { catchError, response } from '@/lib/helperFunctions.js';
import OrderModel from "@/models/Order.model";
import MediaModel from "@/models/MediaModel";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET() {
    try{
        await connectToDB()
        const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response (false,402,'Unauthorized')
        }

const userId=auth.userId

const recentOrders=await OrderModel.find({user:userId}).populate('product.productId' , 'name slug').populate({
    path : 'product.variantId',
    populate :{path : 'media'}
}).limit(10).lean()

const totalOrder=await OrderModel.countDocuments({user:userId})

return response(true,200,'Dashboard Info',{recentOrders,totalOrder})

    } catch (error) {
        return catchError(error)
    }
}