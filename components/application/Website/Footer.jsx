import Image from 'next/image'
import React from 'react'
import logo from '@/public/assets/images/logo-black.png'
import Link from 'next/link'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP } from '@/Routes/website'
import { IoLocationOutline } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
const Footer = () => {
  return (
  <footer className='bg-gray-50 border-t'>
    <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>

      <div className='lg:col-span-1 md:col-span-2 col-span-1'>
         <Image 
            src={logo}
            width={383}
            height={146}
            alt='logo'
            className='w-36 mb-2' />
            <p className='text-gray-500 text-sm'>E-store is your trusted destination for quality and convenience. From fashion to essentials, we bring everything you need right to your doorstep. Shop smart, live better — only at E-store.</p>

      </div>

<div className='relative top-4'>
  <h4 className='text-xl font-bold uppercase mb-5'>Categories</h4>
  <ul>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=t-shirts`}>T-Shirts</Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=hoodies`}>Hoodies</Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=oversized`}>Oversized</Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=full-sleeves`}>Full Sleeves</Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=polo`}>Polo</Link>
    </li>
  </ul>
</div>
<div className='relative top-4'>
  <h4 className='text-xl font-bold uppercase mb-5'>Usefull Links</h4>
  <ul>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_HOME}>Home</Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_SHOP}>Shop</Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href='/about-us'>About</Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_REGISTER}>Register</Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_LOGIN}>Login</Link>
    </li>
    
  </ul>
</div>
<div className='relative top-4'>
  <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
  <ul>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_REGISTER}>Register</Link>
    </li>
      <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_LOGIN}>Login</Link>
    </li>
      <li className='mb-2 text-gray-500'>
      <Link href={USER_DASHBOARD}>My Accounts</Link>
    </li>
      <li className='mb-2 text-gray-500'>
      <Link href='/privacy-policy'>Privacy Policy</Link>
    </li>
      <li className='mb-2 text-gray-500'>
      <Link href='/terms-and-conditions'>Terms & Conditions</Link>
    </li>
  
    
  </ul>
</div>
<div className='relative top-4'>
  <h4 className='text-xl font-bold uppercase mb-5'>Contact Us</h4>
  <ul>
    <li className='mb-2 text-gray-500 flex gap-2'>
      <IoLocationOutline size={30} className='relative right-1' />
      <span className='text-sm'>E-Store Market Delhi, India 110043</span>
    </li>
     <li className='mb-2 text-gray-500 flex gap-2'>
      <MdLocalPhone size={20} />
      <Link href='tel:+91-9911994948' className='hover:text-primary text-sm'>+91-9911994948</Link>
    </li>
    <li className='mb-2 relative top-1 text-gray-500 flex gap-2'>
      <MdOutlineMail size={20} className='absolute'/>
      <Link href='mailto:support@estore.com' className='hover:text-primary relative left-7 bottom-0.5 text-sm'>support@estore.com</Link>
    </li>
 
  
    
  </ul>

<div className='flex gap-5 mt-8'>
  <Link href=''>
  <FiYoutube className='text-primary' size={25} />
  </Link>
   <Link href=''>
  <FaInstagram className='text-primary' size={25} />
  </Link>
   <Link href=''>
  <FaWhatsapp className='text-primary' size={25} />
  </Link>
   <Link href=''>
  <FaFacebook className='text-primary' size={25} />
  </Link>
   <Link href=''>
  <FaXTwitter className='text-primary' size={25} />
  </Link>

</div>


</div>
    </div>
    <div className='py-5 bg-gray-100'>
<p className='text-center'>© 2025 Estore. All Rights Reserved.</p>
    </div>
  </footer>
  )
}

export default Footer
