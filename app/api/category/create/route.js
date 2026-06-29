import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from "@/lib/dbconnection"
import { catchError,response } from "@/lib/helperfunctions"
import { zschema } from "@/lib/zodschema"
import CategoryModel from "@/models/Category.model"

export async function POST(request) {
    try {
        const auth=await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response (false,403,"Unauthorized")
        }

        await connectToDB()
        const payload= await request.json()
        const schema = zschema.pick({ name:true,slug:true})

        const validate= schema.safeParse(payload)
if (!validate.success) {  
    return response(false,400,"Invlaid or missing fields",validate.error)
 }
const {name,slug}=validate.data
 const newCategory= new CategoryModel({
    name,
    slug,
 })
 await newCategory.save()
 return response (true,200,"Category added successfully")
    }
    catch (error) { 
        return catchError(error)
    } 
}
