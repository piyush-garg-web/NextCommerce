import React from 'react'
import { useForm } from "react-hook-form"
import { FormField } from "@/components/ui/form"
import CustomButton from '@/components/application/CustomButton'
import { zodResolver } from '@hookform/resolvers/zod';
import { zschema } from '@/lib/zodSchema'
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useState } from 'react';
import axios from 'axios';
import { showToast } from '@/lib/showToast';


const OTPVerification = ({ email, onSubmit, loading }) => {

    const [isResendingOtp, setIsResendingOtp] = useState(false);
    const formSchema = zschema.pick({ otp: true, email: true });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            otp: "",
            email: email
        },
    })

    const handleOtpVerification = async (values) => {
        onSubmit(values);
    }

    const resendOTP = async () => {
        try {
            setIsResendingOtp(true);
            const { data: resendOtpResponse } = await axios.post('/api/auth/resendotp', { email });
            if (!resendOtpResponse.success) {
                throw new Error(resendOtpResponse.message);
            }

            showToast('success', resendOtpResponse.message);

        } catch (error) {
            showToast('error', error.message);
        }
        finally {
            setIsResendingOtp(false);
 
        } }

        return (
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOtpVerification)} >
                        <div className="text-center"> <h1 className="text-2xl font-bold mb-2">Please Complete Verification !</h1>
                            <p className="text-md">We Have Sent An One-Time Password To Your Registered E-Mail Address. OTP Is Valid For 10 Minutes Only.</p></div> <div className="mt-5 flex justify-center">
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold flex justify-center">One-Time Password (OTP)</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot className="text-xl size-10" index={0} />
                                                    <InputOTPSlot className="text-xl size-10" index={1} />
                                                    <InputOTPSlot className="text-xl size-10" index={2} />
                                                    <InputOTPSlot className="text-xl size-10" index={3} />
                                                    <InputOTPSlot className="text-xl size-10" index={4} />
                                                    <InputOTPSlot className="text-xl size-10" index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="flex justify-center"> <CustomButton loading={loading} type="submit" text="Verify" className="w-[300px] mt-7 cursor-pointer" />

                        </div>
                        <div className='text-center mt-5 flex flex-col justify-center items-center'>
                            {!isResendingOtp ? <button onClick={resendOTP} type="button" className="text-blue-500 cursor-pointer hover:underline" >Resend OTP</button> :
                                <span className='text-md'>Resending ...</span>}
                        </div>

                    </form>
                </Form>
            </div>
        )
    }

export default OTPVerification

