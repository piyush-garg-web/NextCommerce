"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from '@/components/ui/card'
import Logo from '@/public/assets/images/logo-black.png'
import Image from 'next/image'
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
import { zschema } from '@/lib/zodSchema'
import CustomButton from '@/components/application/CustomButton'
import { z } from 'zod'
import { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from 'next/link'
import { WEBSITE_LOGIN } from "@/routes/website"
import axios from 'axios'
import { showToast } from '@/lib/showToast'




const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [isTypePassword, setIsTypePassword] = useState(true);
    const formSchema = zschema.pick({ name: true, email: true, password: true }).extend({ confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { message: "Password and confirm password must be same", path: ["confirmPassword"], });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const handleRegisterSubmit = async (values) => {
        try {
            setLoading(true);
            const { data: registerResponse } = await axios.post('/api/auth/register', values);
            if (!registerResponse.success) {
                throw new Error(registerResponse.message);
            }

            form.reset();
            showToast('success', registerResponse.message);
        } catch (error) {
           showToast('error', error.message);
        }
        finally {
            setLoading(false);

        }
    }
    return (
        <Card className='w-[400px] h-[575px]'>
            <CardContent> <div className='flex justify-center'> <Image src={Logo.src} width={Logo.width} height={Logo.height} alt='Logo' className='max-w-[150px]' />
            </div>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold'>Create Account</h1>
                    <p>Create new account by filling out the form below</p></div> <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegisterSubmit)} >
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full name</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Enter Your Name" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="example@gmail.com" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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

                            <div className="flex justify-center"> <CustomButton loading={loading} type="submit" text="Create Account" className="w-[300px] mt-7 cursor-pointer" />
                            </div>
                            <div className="text-centre">
                                <div className="flex justify-center items-center mt-4 gap-5">
                                    <p> Already have an account ?</p>
                                    <Link href={WEBSITE_LOGIN} className="text-primary underline">Login here</Link> </div>
                            </div>
                        </form>
                    </Form></div></CardContent>
        </Card>
    )
}

export default RegisterPage
