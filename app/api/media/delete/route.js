import { connectToDB } from "@/lib/dbconnection";
import { catchError,response } from "@/lib/helperfunctions";
import MediaModel from "@/models/mediamodel";
import mongoose from "mongoose"
import {v2 as cloudinary} from 'cloudinary'
import { isAuthenticated } from "@/lib/authentication";

cloudinary.config({
    cloud_name:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key:process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
})

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
const media = await MediaModel.find({_id:{$in:ids}}).lean()
if (!media.length) {
    return response (false,404,'Data Not Found')
}
if (!['SD','RSD'].includes(deleteType)) {
    return response (false,400,'Invalid Delete Operation. Delete Type Should Be SD or RSD For This Route')
}
if (deleteType==='SD') {
    await MediaModel.updateMany({_id:{$in:ids}},{$set:{deletedAt:new Date().toISOString()}})
} else {
     await MediaModel.updateMany({_id:{$in:ids}},{$set:{deletedAt:null}})
}
return response (true,200,deleteType==='SD'?'Data Moved Into Trash' : 'Data Restored')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {
const session = await mongoose.startSession()
session.startTransaction()

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
const media = await MediaModel.find({_id:{$in:ids}}).session(session).lean()
if (!media.length) {
    return response (false,404,'Data Not Found')
}
if (deleteType !== 'PD') {
 
    return response (false,400,'Invalid Delete Operation. Delete Type Should Be PD For This Route')
}

await MediaModel.deleteMany({_id:{$in:ids}}).session(session)

const publicIds=media.map(m=>m.public_id)

try {
   await cloudinary.api.delete_resources(publicIds)

} catch (error) {
await session.abortTransaction()
session.endSession()
return catchError(error, 'Failed to delete media from Cloudinary')
}
await session.commitTransaction()
session.endSession()
return response(true,200,'Data Deleted Permanently')

} catch (error) {
    await session.abortTransaction()
session.endSession()
        return catchError(error)
    }
}