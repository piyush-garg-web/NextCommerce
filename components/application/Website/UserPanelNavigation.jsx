'use client'
import Link from 'next/link'
import { USER_DASHBOARD, USER_ORDERS, USER_PROFILE } from '@/routes/website'
import { FaUser } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/reducer/authReducer'

const UserPanelNavigation = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const auth = useSelector(store => store.authStore.auth)

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  return (
    <div className='bg-gray-50 p-4 rounded sticky top-5'>
      <div className='flex items-center gap-3 mb-5 border-b pb-3'>
        <div className='w-12 h-12 bg-primary rounded-full flex justify-center items-center'>
          <FaUser className='text-white' size={20} />
        </div>
        <div>
          <h4 className='font-semibold'>{auth?.name || 'User'}</h4>
          <p className='text-sm text-gray-500'>{auth?.email || ''}</p>
        </div>
      </div>
      <nav>
        <ul>
          <li className='mb-2'>
            <Link href={USER_DASHBOARD} className='flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition-colors'>
              <HiOutlineShoppingBag size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className='mb-2'>
            <Link href={USER_ORDERS} className='flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition-colors'>
              <HiOutlineShoppingBag size={20} />
              <span>Orders</span>
            </Link>
          </li>
          <li className='mb-2'>
            <Link href={USER_PROFILE} className='flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition-colors'>
              <IoSettingsOutline size={20} />
              <span>Profile</span>
            </Link>
          </li>
          <li className='mb-2'>
            <button onClick={handleLogout} className='flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition-colors w-full text-left'>
              <IoSettingsOutline size={20} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default UserPanelNavigation
