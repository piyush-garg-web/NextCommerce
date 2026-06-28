import { connectToDB } from "@/lib/dbconnection";
import { catchError,response } from "@/lib/helperfunctions";
import CategoryModel from "@/models/Category.model";


export async function GET() {
    try {
       
        await connectToDB()
      

        const getCategory=await CategoryModel.find({deletedAt:null}).lean()
        if (!getCategory) {
            return response (false,404,'Category not found')
        }
        return response (true,200,'Category Found',getCategory)
    } catch (error) {
        return catchError(error)
    }
}