import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from '@/lib/dbConnection.js'
import { catchError,response } from '@/lib/helperFunctions.js'
import { zschema } from '@/lib/zodSchema.js'
import ProductModel from "@/models/Product.model"
import { encode } from "entities"

export async function POST(request) {
    try {
        const auth=await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response (false,403,"Unauthorized")
        }

        await connectToDB()
        const payload= await request.json()
          const schema = zschema.pick({
               name: true, 
               slug: true, 
               category: true,
               mrp: true, 
               sellingPrice: true, discountPercentage: true, description: true,
               media:true
           })

        const validate= schema.safeParse(payload)
if (!validate.success) {  
    return response(false,400,"Invlaid or missing fields",validate.error)
 }
const productData=validate.data
 const newProduct= new ProductModel({
    name:productData.name,
    slug:productData.slug,
    category:productData.category,
    mrp:productData.mrp,
    sellingPrice:productData.sellingPrice,
    discountPercentage:productData.discountPercentage,
    description:encode(productData.description),
    media:productData.media,
   
 })
 await newProduct.save()
 return response (true,200,"Product added successfully")
    }
    catch (error) { 
        return catchError(error)
    } 
}
