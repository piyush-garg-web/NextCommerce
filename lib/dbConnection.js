import mongoose from 'mongoose'
const MONGODB_URL = process.env.MONGODB_URL
let cache=global.mongoose

// Import all models to register them
import ProductModel from '@/models/Product.model'
import CategoryModel from '@/models/Category.model'
import MediaModel from '@/models/MediaModel'
import ProductVariantModel from '@/models/ProductVariant.model'
import UserModel from '@/models/UserModel'
import OrderModel from '@/models/Order.model'
import CouponModel from '@/models/Coupon.model'
import ReviewModel from '@/models/Review.model'
import OtpModel from '@/models/OtpModel'

if(!cache) {
  cache=global.mongoose={conn:null,promise:null}
}

export const connectToDB=async()=>{
    if(cache.conn){
        return cache.conn
    } 
    if(!cache.promise){
        cache.promise=mongoose.connect(MONGODB_URL, {dbName:"e-commerce",
            bufferCommands:false
        } ) }

        cache.conn = await cache.promise
        return cache.conn
}