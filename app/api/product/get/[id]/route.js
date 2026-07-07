import { isAuthenticated } from "@/lib/authentication";
import { connectToDB } from "@/lib/dbConnection";
import { catchError,response } from "@/lib/helperFunctions";
import ProductModel from "@/models/Product.model";
import { isValidObjectId } from "mongoose";
import MediaModel from "@/models/mediamodel";

export async function GET(request,{params}) {
    try {
        const auth= await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false,403,'Unauthorized')
        }
        await connectToDB()
        const getParams = await params
        const id =getParams.id
        const filter = {
            deletedAt:null
        }
        if (!isValidObjectId(id)) {
            return response (false,400,'Invalid object id')
        }
        filter._id=id
        const getProduct=await ProductModel.findOne(filter).populate('media','_id secure_url').lean()
        if (!getProduct) {
            return response (false,404,'Product not found')
        }
        return response (true,200,'Product Found',getProduct)
    } catch (error) {
        return catchError(error)
    }
}