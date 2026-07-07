import { connectToDB } from "@/lib/dbConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { isAuthenticated } from "@/lib/authentication";
import MediaModel from "@/models/MediaModel";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";


export async function GET (request, {params}) {
    try {
await connectToDB()
const auth = await isAuthenticated('user')
if (!auth.isAuth) {
    return response (false,402,'Unauthorized')
}
const getParams=await params
const orderid=getParams.orderid
if (!orderid) {
return response(false,404,'Order not found')
}

const orderData = await OrderModel.findOne({order_id:orderid, user: auth.userId}).populate('product.productId' , 'name slug').populate({
    path : 'product.variantId',
    populate :{path : 'media'}
}).lean()

if (!orderData) {
    return response(false,404,'Order not found')
}

return response(true,200,'Order found',orderData)

    } catch (error) {
        return catchError(error)
    }
}