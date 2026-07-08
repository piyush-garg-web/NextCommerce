import AppSidebar from '@/components/application/Admin/AppSidebar'
import TopBar from '@/components/application/Admin/TopBar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { AdminThemeProvider } from '@/components/application/Admin/AdminThemeProvider'

const layout = ({ children }) => {
  return (
    <AdminThemeProvider>
      <SidebarProvider>
        <div className='flex min-h-screen bg-background text-foreground'>
          <AppSidebar />
          <div className='flex-1 flex flex-col'>
            <TopBar />
            <div className='flex-1 md:pe-8 px-5 pt-4 pb-10 overflow-y-auto'>
              {children}
              <div className='border-t h-[40px] flex justify-center items-center bg-muted text-sm mt-10'>
                ©
                2025
                PIYUSH GARG™.
                All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </AdminThemeProvider>
  )
}

export default layout
