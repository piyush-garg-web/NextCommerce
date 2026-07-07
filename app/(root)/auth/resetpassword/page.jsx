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
import { zschema } from '@/lib/zodSchema'
import CustomButton from '@/components/application/CustomButton'

import { useState } from 'react'

import Link from 'next/link'
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from "@/routes/website"
import { showToast } from "@/lib/showToast"
import axios from 'axios'
import OTPVerification from '@/components/application/OTPVerification'
import UpdatePassword from '@/components/application/UpdatePassword'

const ResetPassword = () => {
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
    const [otpEmail, setOtpEmail] = useState();
    const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
    const [isOtpVerified, setisOtpVerified] = useState(false)
    const formSchema = zschema.pick({ email: true });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleEmailVerification = async (values) => {
        try {
            setEmailVerificationLoading(true);
            const { data: sendOtpResponse } = await axios.post('/api/auth/resetpassword/sendotp', values);
            if (!sendOtpResponse.success) {
                throw new Error(sendOtpResponse.message);
            }

            setOtpEmail(values.email);

            showToast('success', sendOtpResponse.message);



        } catch (error) {
            showToast('error', error.message);
        }
        finally {
            setEmailVerificationLoading(false);

        }
    }


    const handleOtpVerification = async (values) => {
        try {
            setOtpVerificationLoading(true);
            const { data: otpResponse } = await axios.post('/api/auth/resetpassword/verifyotp', values);
            if (!otpResponse.success) {
                throw new Error(otpResponse.message);
            }



            showToast('success', otpResponse.message);
            setisOtpVerified(true);


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
                        <h1 className='text-3xl font-bold'>Reset Password</h1>
                        <p>Enter your e-mail for password reset</p></div> <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEmailVerification)} >

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



                                    <div className="flex justify-center"> <CustomButton loading={emailVerificationLoading} type="submit" text="Send OTP" className="w-[300px] mt-7 cursor-pointer" />
                                    </div>
                                    <div className="text-center">
                                        <div className="flex justify-center items-center mt-4 gap-5">

                                            <Link href={WEBSITE_LOGIN} className="text-primary underline">Back To Login </Link> </div>
                                    </div>
                                </form>
                            </Form></div></> : <>
                        {!isOtpVerified ?

                            <OTPVerification email={otpEmail} onSubmit={handleOtpVerification} loading={otpVerificationLoading} />
                            :
                            <UpdatePassword email={otpEmail} />}
                    </>

                }

            </CardContent>
        </Card>
    )
}

export default ResetPassword
