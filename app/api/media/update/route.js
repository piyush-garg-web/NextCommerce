import { isAuthenticated } from "@/lib/authentication";
import { connectToDB } from '@/lib/dbConnection.js';
import { catchError,response } from '@/lib/helperFunctions.js';
import { zschema } from '@/lib/zodSchema.js';
import MediaModel from "@/models/mediamodel";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
    try {
        const auth= await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false,403,'Unauthorized')
        }
        await connectToDB()
       
        const payload = await request.json()
     
   const schema = zschema.pick({ _id:true,alt:true,title:true})

        const validate=schema.safeParse(payload)
       if (!validate.success) {
        return response (false,400,'Invalid or missing field',validate.error)
       }

       const {_id,alt,title}=validate.data
       if (!isValidObjectId(_id)) {
        return response (false,400,'Invalid object id')
       }

       const getMedia= await MediaModel.findById(_id)

       if (!getMedia) {
        return response (false,400,'Media not found')
       }
       getMedia.alt=alt
       getMedia.title=title

await getMedia.save()
return response (true,200,'Media Updated successfully')
    } catch (error) {
        return catchError(error)
    }
}