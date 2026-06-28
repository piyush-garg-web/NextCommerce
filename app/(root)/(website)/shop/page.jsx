'use client'
import Filter from '@/components/application/Website/Filter'
import Sorting from '@/components/application/Website/Sorting'
import WebsiteBreadcrumb from '@/components/application/Website/WebsiteBreadcrumb'
import { WEBSITE_SHOP } from '@/Routes/website'
import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import useWindowSize from '@/hooks/useWindowSize'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import ProductBox from '@/components/application/Website/ProductBox'
import CustomButton from '@/components/application/CustomButton'

const breadcrumb={
    title:'Shop',
    links:[
        {label:'Shop',href:WEBSITE_SHOP}
    ]
}
const Shop = () => {
  const searchParams=useSearchParams().toString()
  const [limit,setLimit]=useState(9)
  const [sorting,setSorting]=useState('default_sorting')
  const[isMobileFilter,setIsMobileFilter]=useState(false)

const windowSize=useWindowSize()
const fetchProduct =async (pageParam)=>{
const {data:getProduct}=await axios.get(`/api/shop/?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`)

if (!getProduct.success) {
  return { products: [], nextPage: null }
}

return getProduct.data

}

const {error,data,isFetching,fetchNextPage,hasNextPage} = useInfiniteQuery({
  queryKey:['products',limit,sorting,searchParams],
  queryFn:async ({pageParam}) => await fetchProduct(pageParam),
  initialPageParam:0,
  getNextPageParam:(lastPage)=>{
    if (!lastPage) return undefined
    return lastPage.nextPage !== null ? lastPage.nextPage : undefined
  }
})

return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
      <section className='lg:flex lg:px-32 px-4 my-20'>
{windowSize.width > 1024 ?
<div className='w-72 me-4'>
    <div className='sticky top-0 bg-gray-50 p-4 rounded'>
        <Filter />
    </div>
</div> :

<Sheet open={isMobileFilter} onOpenChange={()=>
  setIsMobileFilter(false)
}>
 
  <SheetContent side='left' className='block'>
    <SheetHeader className='border-b'>
      <SheetTitle>Filter</SheetTitle>
    </SheetHeader>
    <div className='p-4 overflow-auto h-[calc(100vh-80px)]'>
      <Filter />
    </div>
  </SheetContent>
</Sheet>
}

<div className='lg:w-[calc(100%-18rem)]'>
  <Sorting 
  limit={limit}
  setLimit={setLimit}
  sorting={sorting}
  setSorting={setSorting}
  mobileFilterOpen={isMobileFilter}
  setMobileFilterOpen={setIsMobileFilter} />

{isFetching && <div className='p-3 font-semibold text-center'>Loading ...</div>}
{error && <div className='p-3 font-semibold text-center'>{error.message}</div>}

<div className='grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 mt-10'>

  {data && data.pages.map(page=>(
   page.products.map(product=>(
    <ProductBox key={product._id} product={product} />
   ))
  ))}
</div>

<div className='flex justify-center mt-10'>

{hasNextPage ?
<CustomButton type='button' loading={isFetching} text='Load More' className='cursor-pointer' onClick={fetchNextPage} />
:
<>
{!isFetching && <span>No More Data To Load</span>}
</>
}

</div>

</div>
      </section>
    </div>
  )
}

export default Shop
