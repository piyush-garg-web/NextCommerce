import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import adminLogo from "@/public/assets/images/adminlogo.png"
import { useSelector } from 'react-redux'
import LogoutButton from './LogoutButton'


const UserDropdown = () => {
    const auth=useSelector((store)=>
    store.authStore.auth)

  return (
    <DropdownMenu >
  <DropdownMenuTrigger asChild>
<Avatar className="cursor-pointer">
  <AvatarImage src={auth?.avatar?.url} />
  <AvatarFallback>
    <Image src={adminLogo} alt='Admin' width={40} height={40} />
  </AvatarFallback>
</Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="me-5 w-44">
    <DropdownMenuLabel><p className='font-semibold'>{auth?.name}</p></DropdownMenuLabel>
    <DropdownMenuSeparator />
  <LogoutButton />
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default UserDropdown
