"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
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
import { zschema } from '@/lib/zodschema'
import Custombutton from '@/components/application/CustomButton'
import { z } from 'zod'
import { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from 'next/link'
import { WEBSITE_REGISTER, WEBSITE_RESET_PASSWORD } from "@/Routes/website"
import { showToast } from "@/lib/showToast"
import axios from 'axios'
import OTPVerification from '@/components/application/OTPVerification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ADMIN_DASHBOARD} from "@/Routes/adminpanel"
import { USER_DASHBOARD } from "@/Routes/website"


const LoginPage = () => {
    const dispatch = useDispatch();
    const searchParams=useSearchParams();
    const router=useRouter();
const [loading, setLoading] = useState(false);
const [isTypePassword, setIsTypePassword] = useState(true);
const [otpEmail, setOtpEmail] = useState();
const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
    const formSchema = zschema.pick({ email: true}).extend({password: z.string().min(3, "Password must be at least 3 characters long and is required field")});

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleLoginSubmit = async (values) => {
        
        try {
            setLoading(true);
            const { data: loginResponse } = await axios.post('/api/auth/login', values);
            if (!loginResponse.success) {
                throw new Error(loginResponse.message);
            }

   setOtpEmail(values.email);
            form.reset();
           showToast('success', loginResponse.message);
           
        } catch (error) {
           showToast('error', error.message);
        }
        finally {
            setLoading(false);

        }
     }

     const handleOtpVerification = async (values) => {
             try {
            setOtpVerificationLoading(true);
            const { data: otpResponse} = await axios.post('/api/auth/verifyotp', values);
            if (!otpResponse.success) {
                throw new Error(otpResponse.message);
            }

   setOtpEmail('');
            
           showToast('success', otpResponse.message);

              dispatch(login(otpResponse.data));
              if (searchParams.has('callback')) {
                router.push(searchParams.get('callback'))
              } else {
                otpResponse.data.role=== 'admin' ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD)
              }
           
        } catch (error) {
           showToast('error', error.message);
        }
        finally {
            setOtpVerificationLoading(false);

        }
     }
    return (
        <Card className='w-[400px]'>
            <CardContent> <div className='flex justify-center'> <Image src={Logo.src} width={Logo.width} height={Logo.height} alt='Logo' className='max-w-[150px]' />
            </div>

            {!otpEmail ?
            <>  <div className='text-center'>
                    <h1 className='text-3xl font-bold'>Login Into Account</h1>
                    <p>Login into your account by filling out the form below</p></div> <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleLoginSubmit)} >
                           
                            <div className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email"  placeholder="example@gmail.com" {...field} />
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
                                            <button className="cursor-pointer absolute top-8 right-2" type='button' onClick={()=>setIsTypePassword(!isTypePassword)}>{isTypePassword ? <FaRegEyeSlash /> : <FaRegEye /> }</button>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-center"> <Custombutton loading = {loading} type="submit" text="Login" className="w-[300px] mt-7 cursor-pointer" />
                            </div>
                            <div className="text-centre">
                                <div className="flex justify-center items-center mt-4 gap-5"> 
                                    <p> Don't Have an account ?</p>
                         <Link href={WEBSITE_REGISTER} className="text-primary underline">Create account here  </Link> </div>
                            <div className="text-center mt-1.5"><Link href={WEBSITE_RESET_PASSWORD} className="text-primary underline">Forgot password ? </Link>
                                </div></div>
                        </form>
                    </Form></div></> :
            <OTPVerification email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} /> }
                </CardContent>
        </Card>
    )
}


export default LoginPage



