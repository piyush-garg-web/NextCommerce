'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { zschema } from '@/lib/zodschema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaStar } from 'react-icons/fa6'
import CustomButton from '../CustomButton'
import { useSelector } from 'react-redux'
import { Rating } from '@mui/material'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import Link from 'next/link'
import { WEBSITE_LOGIN } from '@/Routes/website'
import { showToast } from '@/lib/showToast'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import ReviewList from './ReviewList'
import useFetch from '@/hooks/useFetch'



const ProductReview = ({ productId }) => {
  const auth = useSelector(store => store.authStore.auth)
  const [loading, setLoading] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [isReview,setIsReview] =useState(false)
  const [reviewCount,setReviewCount]=useState()

  const {data:reviewDetails}=useFetch(`/api/review/details?productId=${productId}`)

   useEffect(()=>{
if (reviewDetails && reviewDetails.success) {
    const reviewCountData=reviewDetails.data
    setReviewCount(reviewCountData)
}
   },[reviewDetails])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }
  }, [])

  const formSchema = zschema.pick({
    product: true,
    userId: true,
    rating: true,
    title: true,
    review: true,
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: productId,
      userId: auth?._id,
      rating: 0,
      title: '',
      review: '',
    },
  })

  useEffect(()=>{
form.setValue('userId',auth?._id)
  },[auth])


  const handleReviewSubmit = async (values) => {
    setLoading(true)
    try {
      const { data: response } = await axios.post('/api/review/create', values)
      if (!response.success) {
        throw new Error(response.message)
      }
      form.reset()
      showToast('success', response.message)
      await queryClient.invalidateQueries(['product-review']);


    } catch (error) {
      showToast('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchReview=async(pageParam)=>{
    const {data:getReviewData}=await axios.get(`/api/review/get?productId=${productId}&page=${pageParam}`)
     if (!getReviewData.success) {
      return { reviews: [], nextPage: null, totalReview: 0 } 
    }
    return getReviewData.data
  }
    
    const {error,data,isFetching,fetchNextPage,hasNextPage}=useInfiniteQuery({
        queryKey:['product-review'],
        queryFn:async({pageParam})=>await fetchReview(pageParam),
        initialPageParam:0,
        getNextPageParam:(lastPage)=>{
            if (!lastPage) return undefined
            return lastPage.nextPage !== null ? lastPage.nextPage : undefined
        }
    })

    const queryClient = useQueryClient();



    return (
        <div className="shadow rounded border mb-20  ">
            <div className="p-3 bg-gray-50 border-b">
                <h2 className="font-semibold text-2xl">Rating and Reviews</h2>
            </div>
            <div className="p-5">
                <div className='flex justify-between flex-wrap items-center'>
                    <div className='md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5'>
                        <div className='md:w-[200px] w-full md:mb-0 mb-5'>
                            <h4 className='text-center text-8xl font-semibold'>{reviewCount?.averageRating}</h4>
                            <div className='flex justify-center gap-2'>
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />


                            </div>
                            <p className='text-center mt-3'>({reviewCount?.totalReview} Rating & Reviews)</p>
                        </div>

                        <div className='md:w-[calc(100%-200px)] flex items-center'>
                            <div className='w-full'>

                                {[5, 4, 3, 2, 1].map(rating => (
                                    <div key={rating} className='flex items-center gap-2 mb-2'>
                                        <div className='flex items-center gap-1'>
                                            <p className='w-3'>{rating}</p>
                                            <FaStar />
                                        </div>
                                        <Progress value={reviewCount?.percentage[rating]} />
                                        <span className='text-sm'>{reviewCount?.rating[rating]}</span>

                                    </div>
                                ))}



                            </div>
                        </div>


                    </div>

                    <div className='md:w-1/2 w-full md:text-end text-center'>
                        <Button onClick={()=>setIsReview(!isReview)} type='button' className='md:w-fit w-full py-6 px-10 cursor-pointer' variant='outline'>Write Review</Button>

                    </div>
                </div>

                {isReview &&
                <div className='my-5'>
                    <hr className='mb-5' />
                    <h4 className='text-xl font-semibold mb-3'>Write A Review</h4>
                    {!auth 
                    ?
                    <> <p className='mb-2'>Login To Submit Review</p>
<Button type='button' asChild>
    <Link href={`${WEBSITE_LOGIN}?callback=${currentUrl}`} className='mt-3'>Login</Link>
</Button>
</>
                   
                    :

                    <>
                                  

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleReviewSubmit)} >

                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>

                                            <FormControl>
                                                <Rating
                                                    value={field.value}
                                                    size="large"
                                                    {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Review Title" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="review"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Review</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder='Write Your Comment Here ...'
                                                    {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            <div className="flex justify-center"> <CustomButton loading={loading} type="submit" text="Submit Review" className="cursor-pointer mt-10" />
                            </div>

                        </form>
                    </Form>
                    
                    </> }
      
                </div>}
                
<div className='mt-10 border-t pt-5'>
    <h5 className='text-xl font-semibold'>{data?.pages[0]?.totalReview ||0} Reviews</h5>
    <div className='mt-10'>
        {data && data.pages.map(page=>(
            page.reviews.map(review=>(
                <div className='mb-5' key={review._id} > 
                <ReviewList review={review} />
                </div>
            ))
        ))}

{hasNextPage && 
<CustomButton text='Load More' type='button' className='cursor-pointer'
onClick={fetchNextPage} loading={isFetching} />}

    </div>
</div>


            </div>
        </div>
    )
}

export default ProductReview
