import { isAuthenticated } from "@/lib/authentication"
import { connectToDB } from "@/lib/dbconnection"
import { catchError, response } from "@/lib/helperfunctions"
import ProductVariantModel from "@/models/ProductVariant.model"
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
                { color: { $regex: gloabalFilter, $options: 'i' } },
                { size: { $regex: gloabalFilter, $options: 'i' } },
                { sku: { $regex: gloabalFilter, $options: 'i' } },
                {"productData.name":{$regex:gloabalFilter,$options:'i'}},
                {
                    $expr:{
                        $regexMatch: {
                            input: {$toString :"$mrp"},
                            regex:gloabalFilter,
                            options:'i'
                        }
                    }
                },
                 {
                    $expr:{
                        $regexMatch: {
                            input: {$toString :"$sellingPrice"},
                            regex:gloabalFilter,
                            options:'i'
                        }
                    }
                },
                 {
                    $expr:{
                        $regexMatch: {
                            input: {$toString :"$discountPercentage"},
                            regex:gloabalFilter,
                            options:'i'
                        }
                    }
                },

            ]
        }

        filters.forEach(filter => {

            if (filter.id==='mrp' || filter.id==='sellingPrice' || filter.id==='discountPercentage' ) {
matchQuery[filter.id]=Number(filter.value)
            }else if(filter.id==='product') {
matchQuery["productData.name"]={ $regex: filter.value, $options: 'i' }
            }
            else {
matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
            }
            
        })

        let sortQuery = {}
        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        })

        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productData'

                }
            },
            {
                $unwind:
                {
                    path: '$productData', preserveNullAndEmptyArrays: true
                }
            },
            { $match: matchQuery },
            { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
            { $skip: start },
            { $limit: size },
            {
                $project: {
                    _id: 1,
                    product: "$productData.name",
                    color: 1,
                    size: 1,
                    sku: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercentage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    deletedAt: 1
                }
            }
        ]

        const getProductVariant = await ProductVariantModel.aggregate(aggregatePipeline)

        const totalRowCount = await ProductVariantModel.countDocuments(matchQuery)

        return NextResponse.json({
            success: true,
            data: getProductVariant,
            meta: { totalRowCount }
        })

    } catch (error) {
        return catchError(error)
    }

}