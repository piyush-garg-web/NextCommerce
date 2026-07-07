'use client'
import { USER_DASHBOARD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP, USER_ORDERS } from '@/routes/website'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import logo from '@/public/assets/images/logo-black.png'
import { FaSearch, FaSignOutAlt, FaBox } from "react-icons/fa";
import Cart from './Cart'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import userIcon from '@/public/assets/images/user.png'
import { FaBars } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import Search from './Search'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { logout } from '@/store/reducer/authReducer'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


const Header = () => {
  const [isMobileMenu,setIsMobileMenu]=useState(false)
  const [showSearch,setShowSearch]=useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const auth=useSelector(store=>store.authStore.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-dropdown-container')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      dispatch(logout())
      setIsUserMenuOpen(false)
      showToast('success', 'Logged out successfully')
      router.push('/')
    } catch (error) {
      showToast('error', error.message)
    }
  }

  return (
    <div className='no-print bg-white border-b lg:px-32 px-4'>
      <div className='flex justify-between items-center lg:py-5 py-3'>
        <Link href={WEBSITE_HOME}>
        <Image
        src={logo}
        width={383}
        height={146}
        alt='logo'
        className='lg:w-32 w-24' />
        </Link>

        <div className='flex justify-between gap-20'>
          <nav className={`lg:relative lg:w-auto lg:top-0 lg:left-0 lg:h-auto lg:p0 bg-white fixed z-50 top-0 w-full h-screen transition-all ${isMobileMenu ? 'left-0' : '-left-full' }`}>


<div className='lg:hidden flex justify-between items-center bg-gray-50 py-3 border-b px-3'>


  <Image
        src={logo}
        width={383}
        height={146}
        alt='logo'
        className='lg:w-32 w-24' />

        <button type='button' onClick={()=>setIsMobileMenu(false)}>
  <IoMdClose
  size={25}
  className='text-gray-500 hover:text-primary' />
</button>






</div>

<ul className=' lg:flex justify-between items-center gap-10 px-3'>
              <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href={WEBSITE_HOME} className='block py-2'>
                Home</Link>
              </li>
               <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href='/about-us'className='block py-2'>
                About</Link>
              </li>
               <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href={WEBSITE_SHOP} className='block py-2'>
                Shop</Link>
              </li>
               <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href={`${WEBSITE_SHOP}?category=t-shirts`} className='block py-2'>
                T-Shirts</Link>
              </li>
               <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href={`${WEBSITE_SHOP}?category=hoodies`} className='block py-2'>
                Hoodies</Link>
              </li>
                <li className='text-gray-600 hover:text-primary hover:font-semibold'>
                <Link href={`${WEBSITE_SHOP}?category=oversized`} className='block py-2'>
                Oversized</Link>
              </li>
            </ul>

          </nav>
<div className='flex justify-between items-center gap-8'>
<button type='button' onClick={()=>setShowSearch(!showSearch)}>
<FaSearch
className='text-gray-500 hover:text-primary cursor-pointer'
size={25} />
</button>
<Cart />
{!auth ?
<div className='flex items-center gap-3'>
  <Link href={WEBSITE_REGISTER} className='flex items-center gap-2 text-gray-600 hover:text-primary font-semibold'>
    <span>Sign Up</span>
  </Link>
</div> :
<div className='relative user-dropdown-container'>
  <button type='button' onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className='cursor-pointer'>
    <Avatar className='w-10 h-10 border-2 border-gray-200 hover:border-primary transition-colors'>
      <AvatarImage src={auth?.avatar?.url} />
      <AvatarFallback>
        <Image src={userIcon} alt='User' width={40} height={40} />
      </AvatarFallback>
    </Avatar>
  </button>
  {isUserMenuOpen && (
    <div className='absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50'>
      <Link
        href={USER_ORDERS}
        className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100'
        onClick={() => setIsUserMenuOpen(false)}
      >
        <FaBox size={16} />
        My Orders
      </Link>
      <button
        type='button'
        className='flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left'
        onClick={handleLogout}
      >
        <FaSignOutAlt size={16} />
        Logout
      </button>
    </div>
  )}
</div>
}



<button type='button' className='lg:hidden block' onClick={()=>setIsMobileMenu(true)}>
  <FaBars
  size={25}
  className='text-gray-500 hover:text-primary' />
</button>


</div>


        </div>
      </div>


<Search isShow={showSearch} />


    </div>
  )
}

export default Header
