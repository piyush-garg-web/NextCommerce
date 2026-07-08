'use client'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill, RiHome2Line } from "react-icons/ri";
import { useSidebar } from '@/components/ui/sidebar';
import AdminSearch from './AdminSearch'
import logoBlack from '@/public/assets/images/logo-black.png'
import logoWhite from '@/public/assets/images/logo-white.png'
import Image from 'next/image'
import AdminMobileSearch from './AdminMobileSearch'
import Link from 'next/link'
import { WEBSITE_HOME } from '@/routes/website'

const TopBar = () => {
    const {toggleSidebar} = useSidebar()
  return (
    <div className='border h-14 w-full z-30 md:pe-8 px-5 flex justify-between items-center bg-white dark:bg-card flex-shrink-0'>

<div className='flex items-center md:hidden'>
 <Image src={logoBlack.src} height={50} width={logoBlack.width} className='block dark:hidden h-[50px] w-auto' alt="logodark" />
    <Image src={logoWhite.src} height={50} width={logoWhite.width} className='hidden dark:block h-[50px] w-auto' alt="logowhite"/>

</div>
        <div className='relative left-67 md:block hidden'>
            <AdminSearch />
        </div>


        <div className='flex items-center gap-2'>
            <AdminMobileSearch />
            <ThemeSwitch />
            <Link href={WEBSITE_HOME}>
              <Button type="button" variant="ghost" className="flex items-center gap-2">
                <RiHome2Line />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden">
                <RiMenu4Fill />
            </Button>
        </div>

    </div>
  )
}

export default TopBar
