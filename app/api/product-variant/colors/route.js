import { connectToDB } from '@/lib/dbConnection.js';
import { catchError,response } from '@/lib/helperFunctions.js';
import ProductVariantModel from "@/models/ProductVariant.model";



export async function GET() {
    try {
       
        await connectToDB()
      

        const getColor=await ProductVariantModel.distinct('color')
        if (!getColor) {
            return response (false,404,'Color not found')
        }
        return response (true,200,'Color Found',getColor)
    } catch (error) {
        return catchError(error)
    }
}