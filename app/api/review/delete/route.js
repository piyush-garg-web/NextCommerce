import { connectToDB } from "@/lib/dbConnection";
import { catchError,response } from "@/lib/helperFunctions";
import mongoose from "mongoose"
import { isAuthenticated } from "@/lib/authentication";
import ReviewModel from "@/models/Review.model";

export async function PUT(request) {
    try {
const auth = await isAuthenticated('admin')
if (!auth.isAuth) {
    return response (false,403,'Unauthorized')
}
await connectToDB()
const payload=await request.json()
const ids=payload.ids || []
const deleteType=payload.deleteType

if (!Array.isArray(ids) || ids.length===0) {
    return response (false,400,'Invalid Or Empty Id List')
}
const data = await ReviewModel.find({_id:{$in:ids}}).lean()
if (!data.length) {
    return response (false,404,'Data Not Found')
}
if (!['SD','RSD'].includes(deleteType)) {
    return response (false,400,'Invalid Delete Operation. Delete Type Should Be SD or RSD For This Route')
}
if (deleteType==='SD') {
    await ReviewModel.updateMany({_id:{$in:ids}},{$set:{deletedAt:new Date().toISOString()}})
} else {
     await ReviewModel.updateMany({_id:{$in:ids}},{$set:{deletedAt:null}})
}
return response (true,200,deleteType==='SD'?'Data Moved Into Trash' : 'Data Restored')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {


    try {
const auth = await isAuthenticated('admin')
if (!auth.isAuth) {
    return response (false,403,'Unauthorized')
}
await connectToDB()
const payload=await request.json()
const ids=payload.ids || []
const deleteType=payload.deleteType

if (!Array.isArray(ids) || ids.length===0) {
    return response (false,400,'Invalid Or Empty Id List')
}
const data = await ReviewModel.find({_id:{$in:ids}}).lean()
if (!data.length) {
    return response (false,404,'Data Not Found')
}
if (deleteType !== 'PD') {
 
    return response (false,400,'Invalid Delete Operation. Delete Type Should Be PD For This Route')
}

await ReviewModel.deleteMany({_id:{$in:ids}})

return response(true,200,'Data Deleted Permanently')

} catch (error) {
  
        return catchError(error)
    }
}