'use client'
import BreadCrumb from '@/components/application/Admin/BreadCrumb'
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from '@/Routes/adminpanel'
import React, { use, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { zschema } from '@/lib/zodschema'
import CustomButton from '@/components/application/CustomButton'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import slugify from 'slugify'
import useFetch from '@/hooks/useFetch'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
   { href: '', label: "Edit Category" },
  
]
const EditCategory = ({params}) => {

  const {id}=use(params)
  const {data:categoryData}=useFetch(`/api/category/get/${id}`)

  const [loading,setLoading]=useState(false)
  const formSchema = zschema.pick({ _id:true,name:true,slug:true})
  
      const form = useForm({
          resolver: zodResolver(formSchema),
          defaultValues: {
         _id:id,
         name:"",
         slug:"",
        
          },
      })

      useEffect(() => {
  if (categoryData && categoryData.success) {
    const data=categoryData.data
    form.reset({
      _id:data?._id,
      name:data?.name,
      slug:data?.slug,
    })
      }
    }
      , [categoryData])



        useEffect(() => {
  const name=form.getValues('name')
  if (name) {
    form.setValue('slug',slugify(name).toLowerCase())
  }
}, [form.watch('name')])

const onSubmit = async (values) =>{
setLoading(true)
try {
const {data:response}= await axios.put('/api/category/update',values)
if (!response.success) {
  throw new Error(response.message)
} 

showToast('success',response.message)

} catch (error) {
  showToast('error',error.message)
      } finally{ 
        setLoading(false)
      } }
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className='py-0 rounded shadow-sm'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className='font-semibold text-xl'>Edit Category</h4>
        </CardHeader>
        <CardContent className='pb-5'>

          <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                           
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input type="text"  placeholder="Enter category name" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
<div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input type="text"  placeholder="Enter slug" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            

                            <div className="flex justify-center"> <CustomButton loading = {loading} type="submit" text="Update Category" className="cursor-pointer mt-4" />
                            </div>
                           
                        </form>
                    </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditCategory
