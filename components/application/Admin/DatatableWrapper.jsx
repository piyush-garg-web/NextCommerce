'use client'
import { ThemeProvider } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Datatable from './Datatable'
import { useAdminTheme } from './AdminThemeProvider'
import { darkTheme, lightTheme } from '@/lib/materialTheme'

const DatatableWrapper = ({ queryKey,fetchUrl,columnsConfig,initialPageSize = 10,exportEndpoint,deleteEndpoint,deleteType,trashView,createAction}) => {

  const { theme } = useAdminTheme()
  const [mounted,setMounted]=useState(false)
  useEffect(()=>{
    setMounted(true)
  },[])

  if(!mounted){
    return null
  }

  return (
   <ThemeProvider theme={theme==='dark' ? darkTheme : lightTheme}>
    
    <Datatable  
    queryKey={queryKey}
    fetchUrl={fetchUrl}
    columnsConfig={columnsConfig}
    initialPageSize={initialPageSize}
    exportEndpoint={exportEndpoint}
    deleteEndpoint={deleteEndpoint}
    deleteType={deleteType}
    trashView ={trashView}
    createAction={createAction}  />
   </ThemeProvider>
  )
}

export default DatatableWrapper
