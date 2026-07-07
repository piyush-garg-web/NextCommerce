'use client'
import BreadCrumb from '@/components/application/Admin/BreadCrumb'
import DatatableWrapper from '@/components/application/Admin/DatatableWrapper'
import DeleteAction from '@/components/application/Admin/DeleteAction'
import EditAction from '@/components/application/Admin/EditAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_PRODUCT_COLUMNS } from '@/lib/column'
import { columnConfig } from '@/lib/helperFunctions'
import { ADMIN_PRODUCT_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_EDIT } from '@/routes/adminpanel'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa6'


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Product" },
   ]
const ShowProduct = () => {
  const columns=useMemo(() => {
    return columnConfig(DT_PRODUCT_COLUMNS) 
  },[])

  const action=useCallback((row,deleteType,handleDelete)=>{
let actionMenu=[]
actionMenu.push(<EditAction key='edit' href={ADMIN_PRODUCT_EDIT(row.original._id)}/>)
actionMenu.push(<DeleteAction key='delete'handleDelete={handleDelete} row={row} deleteType={deleteType}/>)
return actionMenu
  },[])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className='py-0 rounded shadow-sm gap-0'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <div className='flex justify-between items-center '><h4 className='font-semibold text-xl'>Show Product</h4>
          <Button className='cursor-pointer'>
            <FaPlus />
            <Link href={ADMIN_PRODUCT_ADD}>New Product
            </Link>
          </Button> </div>
          
        </CardHeader>
        <CardContent className='pt-0 px-0'>
<DatatableWrapper 
queryKey='product-data'
fetchUrl='/api/product'
initialPageSize={10}
columnsConfig={columns}
exportEndpoint='/api/product/export'
deleteEndpoint='/api/product/delete'
deleteType='SD' 
trashView={`${ADMIN_TRASH}?trashof=product`}
createAction={action}
/>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowProduct
