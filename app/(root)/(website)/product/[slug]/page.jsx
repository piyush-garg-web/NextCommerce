import React from 'react'
import ProductDetails from './ProductDetails'
import { connectToDB } from '@/lib/dbconnection'
import ProductModel from '@/models/Product.model'
import ProductVariantModel from '@/models/ProductVariant.model'
import ReviewModel from '@/models/Review.model'

const ProductPage = async ({ params, searchParams }) => {
    try {
        const { slug } = await params
        const resolvedSearchParams = await searchParams
        const color = resolvedSearchParams.color
        const size = resolvedSearchParams.size

        await connectToDB()

        const filter = {
            deletedAt: null
        }

        if (!slug) {
            return (
                <div className='flex justify-center items-center py-10 h-[300px]'>
                    <h1 className='text-4xl font-semibold'>Data Not Found</h1>
                </div>
            )
        }
        filter.slug = slug

        const getProduct = await ProductModel.findOne(filter).populate('media', 'secure_url').lean()

        if (!getProduct) {
            return (
                <div className='flex justify-center items-center py-10 h-[300px]'>
                    <h1 className='text-4xl font-semibold'>Data Not Found</h1>
                </div>
            )
        }

        const variantFilter = {
            product: getProduct._id,
            deletedAt: null
        }

        if (size) {
            variantFilter.size = size
        }
        if (color) {
            variantFilter.color = color
        }

        let variant = await ProductVariantModel.findOne(variantFilter).populate('media', 'secure_url').lean()

        if (!variant) {
            // If no matching variant, find first available variant
            variant = await ProductVariantModel.findOne({
                product: getProduct._id,
                deletedAt: null
            }).populate('media', 'secure_url').lean()
        }

        if (!variant) {
            return (
                <div className='flex justify-center items-center py-10 h-[300px]'>
                    <h1 className='text-4xl font-semibold'>Data Not Found</h1>
                </div>
            )
        }

        const getColor = await ProductVariantModel.distinct('color', {
            product: getProduct._id,
            deletedAt: null
        })

        const getSize = await ProductVariantModel.aggregate([
            { $match: { product: getProduct._id, deletedAt: null } },
            { $sort: { _id: 1 } },
            {
                $group: {
                    _id: '$size',
                    first: { $first: '$_id' }
                }
            },
            {
                $sort: { first: 1 }
            },
            {
                $project: { _id: 0, size: '$_id' }
            }
        ])

        const review = await ReviewModel.countDocuments({
            product: getProduct._id,
            deletedAt: null
        })

        // Convert Mongoose objects to plain JS objects to fix Next.js server-client prop error
        const plainProduct = JSON.parse(JSON.stringify(getProduct))
        const plainVariant = JSON.parse(JSON.stringify(variant))
        const plainColors = JSON.parse(JSON.stringify(getColor))
        const plainSizes = getSize.length ? JSON.parse(JSON.stringify(getSize.map(item => item.size))) : []
        const plainReviewCount = review

        return (
            <ProductDetails
                product={plainProduct}
                variant={plainVariant}
                colors={plainColors}
                sizes={plainSizes}
                reviewCount={plainReviewCount}
            />
        )
    } catch (error) {
        console.error(error)
        return (
            <div className='flex justify-center items-center py-10 h-[300px]'>
                <h1 className='text-4xl font-semibold'>Something went wrong</h1>
            </div>
        )
    }
}

export default ProductPage