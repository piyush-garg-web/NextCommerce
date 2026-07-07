import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { showToast } from '@/lib/showToast';
import { WEBSITE_HOME } from '@/routes/website';
import { useRouter } from 'next/navigation';
import React from 'react'
import { MdLogout } from "react-icons/md";
import { useDispatch } from 'react-redux';
import axios from 'axios'
import { logout } from '@/store/reducer/authReducer';

const LogoutButton  = () => {
    const dispatch =useDispatch()
    const router=useRouter()
    const handleLogout = async () => {
        try {
            const {data:logoutResponse} = await axios.post('/api/auth/logout')

            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }
            dispatch(logout())
            showToast("success",logoutResponse.message)
            router.push(WEBSITE_HOME)
        } catch(error) {
            showToast("error",error.message)
        }
    }
  return (
    <DropdownMenuItem onClick = {handleLogout} className="cursor-pointer"><MdLogout color="red" />Logout</DropdownMenuItem>
  )
}

export default LogoutButton
