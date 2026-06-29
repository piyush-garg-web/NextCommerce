'use client'
import BreadCrumb from '@/components/application/Admin/BreadCrumb'
import DatatableWrapper from '@/components/application/Admin/DatatableWrapper'
import DeleteAction from '@/components/application/Admin/DeleteAction'
import EditAction from '@/components/application/Admin/EditAction'
import ViewAction from '@/components/application/Admin/ViewAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DT_COUPON_COLUMNS, DT_ORDER_COLUMNS} from '@/lib/column'
import { columnConfig } from '@/lib/helperfunctions'
import {ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_COUPON_SHOW, ADMIN_COUPON_EDIT, ADMIN_COUPON_ADD, ADMIN_ORDER_DETAILS } from '@/Routes/adminpanel'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import { FaPlus } from 'react-icons/fa6'


const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: '', label: "Orders" },
   ]
const ShowOrder = () => {
  const columns=useMemo(() => {
    return columnConfig(DT_ORDER_COLUMNS) 
  },[])

  const action=useCallback((row,deleteType,handleDelete)=>{
let actionMenu=[]
actionMenu.push(<ViewAction key='view' href={ADMIN_ORDER_DETAILS(row.original.order_id)}/>)
actionMenu.push(<DeleteAction key='delete'handleDelete={handleDelete} row={row} deleteType={deleteType}/>)
return actionMenu
  },[])

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className='py-0 rounded shadow-sm gap-0'>
        <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
          <div className='flex justify-between items-center '><h4 className='font-semibold text-xl'>Orders</h4>
           </div>
          
        </CardHeader>
        <CardContent className='pt-0 px-0'>
<DatatableWrapper 
queryKey='orders-data'
fetchUrl='/api/orders'
initialPageSize={10}
columnsConfig={columns}
exportEndpoint='/api/orders/export'
deleteEndpoint='/api/orders/delete'
deleteType='SD' 
trashView={`${ADMIN_TRASH}?trashof=orders`}
createAction={action}
/>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowOrder
