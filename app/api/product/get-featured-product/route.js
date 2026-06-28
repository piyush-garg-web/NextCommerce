import { connectToDB } from "@/lib/dbconnection";
import { catchError,response } from "@/lib/helperfunctions";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/mediamodel";

export async function GET() {
    try {
    
        await connectToDB()
    
        
        const getProduct=await ProductModel.find({deleteType:null}).populate('media').limit(8).lean()
        if (!getProduct) {
            return response (false,404,'Product not found')
        }
        return response (true,200,'Product Found',getProduct)
    } catch (error) {
        return catchError(error)
    }
}