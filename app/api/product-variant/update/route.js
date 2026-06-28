import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from "@/lib/dbconnection"
import { catchError,response } from "@/lib/helperfunctions"
import { zschema } from "@/lib/zodschema"
import ProductVariantModel from "@/models/ProductVariant.model"



export async function PUT(request) {
    try {
        const auth=await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response (false,403,"Unauthorized")
        }

        await connectToDB()
        const payload= await request.json()
             const schema = zschema.pick({
               _id:true,product:true,sku:true,color:true,size:true,
               mrp: true, sellingPrice: true, discountPercentage: true, media:true,
           })

        const validate= schema.safeParse(payload)
if (!validate.success) {  
    return response(false,400,"Invlaid or missing fields",validate.error)
 } 
const validatedData=validate.data
 const getProductVariant= await ProductVariantModel.findOne({deletedAt:null,_id:validatedData._id})
    if (!getProductVariant) {
        return response (false,404,"Data not found") }

getProductVariant.product=validatedData.product
getProductVariant.color=validatedData.color
getProductVariant.size=validatedData.size
getProductVariant.sku=validatedData.sku
getProductVariant.mrp=validatedData.mrp
getProductVariant.sellingPrice=validatedData.sellingPrice
getProductVariant.discountPercentage=validatedData.discountPercentage
getProductVariant.media=validatedData.media

    await getProductVariant.save()
 return response (true,200,"Product variant updated successfully")
    }
    catch (error) { 
        return catchError(error)
    } 
}
