import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from "@/lib/dbConnection"
import { catchError, response } from "@/lib/helperFunctions"
import OrderModel from "@/models/Order.model"
import { NextResponse } from "next/server"

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
                { order_id: { $regex: gloabalFilter, $options: 'i' } },
                { payment_id: { $regex: gloabalFilter, $options: 'i' } },
                { name: { $regex: gloabalFilter, $options: 'i' } },
                { email: { $regex: gloabalFilter, $options: 'i' } },
                { phone: { $regex: gloabalFilter, $options: 'i' } },
                { country: { $regex: gloabalFilter, $options: 'i' } },
                { state: { $regex: gloabalFilter, $options: 'i' } },
                { city: { $regex: gloabalFilter, $options: 'i' } },
                { pincode: { $regex: gloabalFilter, $options: 'i' } },
                { disocunt: { $regex: gloabalFilter, $options: 'i' } },
                { couponDiscount: { $regex: gloabalFilter, $options: 'i' } },
                { totalAmount: { $regex: gloabalFilter, $options: 'i' } },
                { status: { $regex: gloabalFilter, $options: 'i' } },

            ]
        }

        filters.forEach(filter => {
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            }

        )

        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        })

        const aggregatePipeline = [

            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
        ]

        const getOrders = await OrderModel.aggregate(aggregatePipeline)

        const totalRowCount = await OrderModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getOrders,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }

}