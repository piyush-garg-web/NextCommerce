import { connectToDB } from "@/lib/dbconnection";
import { catchError, response } from "@/lib/helperfunctions";
import { zschema } from "@/lib/zodschema";
import CouponModel from "@/models/Coupon.model";

export async function POST(request) {
    try {

        await connectToDB()
        const payload=await request.json()
         const couponFormSchema=zschema.pick({
            code:true,
            minShoppingAmount:true,
        
          })

const validate=couponFormSchema.safeParse(payload)
if (!validate.success) {
    return response(false,400,'Missing or invalid data',validate.error)
}

const {code,minShoppingAmount} = validate.data
const couponData=await CouponModel.findOne({code}).lean()

if (!couponData) {
    return response (false,400,'Invalid or expired coupon code')
}

if (new Date() > couponData.validity) {
    return response (false,400,'Coupon code expired')
}

if (minShoppingAmount < couponData.minShoppingAmount) {
    return response (false,400,'Insufficient shopping amount')
}

return response(true,200,'Coupon applied successfully',{discountPercentage : couponData.discountPercentage})


    } catch(error) {
        return catchError(error)
    }
}