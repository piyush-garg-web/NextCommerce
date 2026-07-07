import AppSidebar from '@/components/application/Admin/AppSidebar'
import ThemeProvider from '@/components/application/Admin/ThemeProvider'
import TopBar from '@/components/application/Admin/TopBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({ children }) => {
  return (
<ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange>
  <SidebarProvider>
      <div className='flex min-h-screen'>
        <AppSidebar />
        <div className='flex-1 flex flex-col'>
          <TopBar />
          <div className='flex-1 md:pe-8 px-5 pt-4 pb-10 overflow-y-auto'>
            {children}
            <div className='border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm mt-10'>
              ©
              2025
              PIYUSH GARG™.
              All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
</ThemeProvider>


  )
}

export default layout
