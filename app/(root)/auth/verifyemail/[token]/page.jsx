"use client";

import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import verifiedImg from "@/public/assets/images/verified.gif";
import verificationFailedImg from "@/public/assets/images/verification-failed.gif";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WEBSITE_HOME } from "@/routes/website";
import { use, useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { login } from '@/store/reducer/authReducer';
import { useRouter } from 'next/navigation';

const EmailVerification = ({params }) => {

  const {token} = use(params)
  const dispatch = useDispatch();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const {data: verificationResponse} = await axios.post('/api/auth/verifyemail', {token} );

        if (verificationResponse.success) {
          setIsVerified(true);
          // Auto-login user
          if (verificationResponse.data) {
            dispatch(login(verificationResponse.data));
          }
          // Auto redirect to home page after 2 seconds
          setTimeout(() => {
            router.push(WEBSITE_HOME);
          }, 2000);
        }
      } catch (error) {
        console.error('Verification error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    verify();
  }, [token, dispatch, router]);

  if (isLoading) {
    return (
      <Card className="w-[400px]">
        <CardContent>
          <div className="text-center py-10">
            <p>Verifying your email...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

return (
    <Card className="w-[400px]">
        <CardContent>
          {isVerified ? <div>
            <div className="flex justify-center items-center">
              <Image src={verifiedImg.src} alt="verified" height={verifiedImg.height} width={verifiedImg.width} /> </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold my-5 text-green-500">
                Email Verification Success !
              </h1>
                <p className="text-gray-600 mb-4">Redirecting to home page...</p>
                <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping !</Link>
              </Button></div>
            </div>
            : <div>
            <div className="flex justify-center items-center">
              <Image src={verificationFailedImg.src} alt="unverified" height={verificationFailedImg.height} width={verificationFailedImg.width} /> </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold my-5 text-red-500">
                Email Verification Failed !
              </h1>
                <Button asChild>
                <Link href={WEBSITE_HOME}>Try Again !</Link>
              </Button></div>
            </div> }


        </CardContent>
      </Card>

  );
};

export default EmailVerification;
