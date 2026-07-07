import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from "@/lib/dbConnection"
import { catchError, response } from "@/lib/helperFunctions"
import { NextResponse } from "next/server"
import UserModel from "@/models/user.model"

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized")
        }

        await connectToDB()

        const searchParams = request.nextUrl.searchParams

        const start = parseInt(searchParams.get('start') || 0, 10)
        const size = parseInt(searchParams.get('size') || 10, 10)
        const filters = JSON.parse(searchParams.get('filters') || "[]")
        const gloabalFilter = searchParams.get('globalFilter') || ""
        const sorting = JSON.parse(searchParams.get('sorting') || "[]")
        const deleteType = searchParams.get('deleteType')

        let matchQuery = {}

        if (deleteType === 'SD') {
            matchQuery = { deletedAt: null }
        } else if (deleteType === 'PD') {
            matchQuery = { deletedAt: { $ne: null } }
        }

        if (gloabalFilter) {
            matchQuery['$or'] = [
                { name: { $regex: gloabalFilter, $options: 'i' } },
                 { email: { $regex: gloabalFilter, $options: 'i' } },
                  { phone: { $regex: gloabalFilter, $options: 'i' } },
                   { address: { $regex: gloabalFilter, $options: 'i' } },
                    { isEmailVerified: { $regex: gloabalFilter, $options: 'i' } },
              
            ]
        }

        filters.forEach(filter => {

            matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            
        })

        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        })

        const aggregatePipeline = [
            
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email:1,
                    phone:1,
                    address:1,
                    avatar:1,
                    isEmailVerified:1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1
                }
            }
        ]

        const getCustomers = await UserModel.aggregate(aggregatePipeline)

        const totalRowCount = await UserModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getCustomers,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }

}