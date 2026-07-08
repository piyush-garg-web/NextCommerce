'use client'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { Button } from '@/components/ui/button';
import { useAdminTheme } from './AdminThemeProvider'

const ThemeSwitch = () => {
    const { theme, setTheme } = useAdminTheme()
  return (
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button type="button" variant="ghost" className="cursor-pointer">
        <IoSunnyOutline className={theme === 'dark' ? 'hidden' : 'block'} />
        <IoMoonOutline className={theme === 'dark' ? 'block' : 'hidden'} />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
 
    <DropdownMenuItem onClick={()=>setTheme('light')}>Light</DropdownMenuItem>
    <DropdownMenuItem  onClick={()=>setTheme('dark')}>Dark</DropdownMenuItem>
   
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default ThemeSwitch
