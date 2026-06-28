import { connectToDB } from '@/lib/dbconnection';
import ProductModel from '@/models/Product.model';
import MediaModel from '@/models/mediamodel';
import Link from 'next/link'
import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import ProductBox from './ProductBox';

const FeaturedProduct = async () => {
    await connectToDB();
    const getProduct = await ProductModel.find({ deleteType: null }).populate('media').limit(8).lean();

    if (!getProduct) {
        return null
    }
  return (
   <section className='lg:px-32 px-4 sm:py-10'>
    <div className='flex justify-between items-center mb-5'>
<h2 className='sm:text-4xl text-2xl font-semibold '>Featured Products !</h2>
<Link href='' className='flex items-center gap-2 underline underline-offset-4 hover:text-primary'>
View All <FaArrowRight />
</Link>
  </div>
  <div className='grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2'>
{getProduct.length === 0 && <div className='text-center py-5'>Data Not Found</div>}
{getProduct.map((product)=>(
    <ProductBox key={product._id} product={product} />
))}
  </div>

   </section>
  )
}

export default FeaturedProduct
