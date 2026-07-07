import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from '@/lib/dbConnection.js'
import { catchError,response } from '@/lib/helperFunctions.js'
import { zschema } from '@/lib/zodSchema.js'
import CouponModel from "@/models/Coupon.model"


export async function POST(request) {
    try {
        const auth=await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response (false,403,"Unauthorized")
        }

        await connectToDB()
        const payload= await request.json()
          const schema = zschema.pick({
             code:true,
    discountPercentage: true, 
    minShoppingAmount:true,
    validity:true
           })

        const validate= schema.safeParse(payload)
if (!validate.success) {  
    return response(false,400,"Invlaid or missing fields",validate.error)
 }
const couponData=validate.data
 const newCoupon= new CouponModel({
 code:couponData.code,
 discountPercentage:couponData.discountPercentage,
 minShoppingAmount:couponData.minShoppingAmount,
 validity:couponData.validity,
 })
 await newCoupon.save()
 return response (true,200,"Coupon added successfully")
    }
    catch (error) { 
        return catchError(error)
    } 
}
