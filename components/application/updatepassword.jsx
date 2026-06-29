"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zschema } from '@/lib/zodschema'
import Custombutton from '@/components/application/CustomButton'
import { z } from 'zod'
import { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'
import { WEBSITE_LOGIN } from '@/Routes/website'




const UpdatePassword = ({email}) => {
    const router =useRouter()
    const [loading, setLoading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true);
    const formSchema = zschema.pick({  email:true, password: true }).extend({ confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { message: "Password and confirm password must be same", path: ["confirmPassword"], });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email:email,
            password: "",
            confirmPassword: "",
        },
    })

    const handlePasswordUpdate = async (values) => {
        try {
            setLoading(true);
            const { data: passwordUpdate } = await axios.put('/api/auth/resetpassword/updatepassword', values);
            if (!passwordUpdate.success) {
                throw new Error(passwordUpdate.message);
            }

            form.reset();
            showToast('success', passwordUpdate.message);
            router.push(WEBSITE_LOGIN)
        } catch (error) {
           showToast('error', error.message);
        }
        finally {
            setLoading(false);

        }
    }
    return (
      
            <div>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold'>Update Password</h1>
                    <p>Create new password by filling below form</p></div> <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handlePasswordUpdate)} >
                                 

                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type={isTypePassword ? 'password' : 'text'} placeholder="********" {...field} />
                                            </FormControl>
                                            <button className="cursor-pointer absolute top-8 right-2" type='button' onClick={() => setIsTypePassword(!isTypePassword)}>{isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}</button>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input type={isTypePassword ? 'password' : 'text'} placeholder="********" {...field} />
                                            </FormControl>
                                            <button className="cursor-pointer absolute top-8 right-2" type='button' onClick={() => setIsTypePassword(!isTypePassword)}>{isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}</button>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-center"> <Custombutton loading={loading} type="submit" text="Update Password" className="w-[300px] mt-7 cursor-pointer" />
                            </div>
                            
                        </form>
                    </Form></div></div>
    
    )
}

export default UpdatePassword
