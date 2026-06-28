import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from "@/lib/dbconnection"
import { catchError,response } from "@/lib/helperfunctions"
import { zschema } from "@/lib/zodschema"
import ReviewModel from "@/models/Review.model"
import { authReducer } from "@/store/reducer/authReducer"


export async function POST(request) {
    try {
        const auth=await isAuthenticated('user')
        if (!auth.isAuth) {
            return response (false,403,"Unauthorized")
        }

        await connectToDB()
        const payload= await request.json()
        const schema = zschema.pick({ product: true, userId: true, rating: true, title: true,
        review: true})

        const validate= schema.safeParse(payload)
if (!validate.success) {  
    return response(false,400,"Invlaid or missing fields",validate.error)
 }
const {product,userId,rating,title,review}=validate.data
 const newReview= new ReviewModel({
    product:product,
    user:userId,
    rating:rating,
    title:title,
    review:review,
 })
 await newReview.save()
 return response (true,200,"Your review submitted successfully")
    }
    catch (error) { 
        return catchError(error)
    } 
}
