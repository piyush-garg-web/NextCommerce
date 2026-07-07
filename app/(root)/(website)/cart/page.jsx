'use client'
import WebsiteBreadcrumb from '@/components/application/Website/WebsiteBreadcrumb'
import { Button } from '@/components/ui/button'
import { WEBSITE_CHECKOUT, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP, WEBSITE_LOGIN } from '@/routes/website'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { showToast } from '@/lib/showToast'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'

const breadCrumb = {
  title: 'Cart',
  links: [
    { label: 'Cart' }
  ]
}

const GST_RATE = 0.18

const CartPage = () => {
  const dispatch = useDispatch()
  const cart = useSelector(store => store.cartStore)
  const authStore = useSelector(store => store.authStore)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (cart.count > 0 && !authStore.auth) {
      showToast('error', 'Please login to view your cart')
      router.push(`${WEBSITE_LOGIN}?callback=${encodeURIComponent(pathname)}`)
    }
  }, [authStore.auth, cart.count, router, pathname])
   const[subtotal,setSubtotal]=useState(0)
  const[discount,setDiscount]=useState(0)
  const[taxAmount,setTaxAmount]=useState(0)
  const[totalAmount,setTotalAmount]=useState(0)
 

    useEffect(()=>{
  const cartProducts=cart.products
  const subtotal=cartProducts.reduce((sum,product)=>sum+(product.sellingPrice*product.qty),0)
  const discount=cartProducts.reduce((sum,product)=>sum+((product.mrp-product.sellingPrice)*product.qty),0)
  const taxableAmount=Math.max(subtotal-discount,0)
  const tax=Number((taxableAmount * GST_RATE).toFixed(2))
  const payableAmount=Number((taxableAmount+tax).toFixed(2))
  
  setSubtotal(subtotal)
  setDiscount(discount)
  setTaxAmount(tax)
  setTotalAmount(payableAmount)
  
    },[cart])


  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumb} />
      {cart.count === 0
        ?
        <div className='w-screen h-[500px] flex justify-center items-center py-32'>
          <div className='text-center'>
            <h4 className='text-4xl font-semibold mb-5'>Your Cart Is Empty !!!</h4>
            <Button type='button' asChild>
              <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
            </Button>

          </div>
        </div>
        :
        <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
          <div className='lg:w-[70%] w-full'>
            <table className='w-full border'>
              <thead className='border-b bg-gray-50 md:table-header-group hidden'>
                <tr>
                  <th className='text-start p-3'>Product</th>
                  <th className='text-center p-3'>Price</th>
                  <th className='text-center p-3'>Quantity</th>
                  <th className='text-center p-3'>Total</th>
                  <th className='text-center p-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.products.map(product => (
                  <tr key={product.variantId} className='md:table-row block border-b'>
                    <td className='p-3'>
                      <div className='flex items-center gap-5'>
                        <Image src={product.media || imgPlaceholder.src}
                          width={60}
                          height={60}
                          alt={product.name} />
                        <div>
                          <h4 className='text-lg font-medium line-clamp-1'><Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link></h4>
                          <p className='text-sm'>Color : {product.color}</p>
                          <p className='text-sm'>Size : {product.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium'>Price</span>
                      <span>{product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>

                    </td>
                    <td className='md:table-cell flex justify-between md:p-3 px-3 pb-2'>
                      <span className='md:hidden font-medium'>Quantity</span>
                      <div className='flex justify-center'>
                        <div className="flex justify-center items-center md:h-10 h-7 border w-fit rounded-full">
                          <button type='button' className="h-full w-10 flex justify-center items-center cursor-pointer" onClick={() => dispatch(decreaseQuantity({productId: product.productId, variantId: product.variantId}))}>
                            <FaMinus />
                          </button>
                          <input type='text' value={product.qty} className="md:w-14 w-8 text-center border-none outline-offset-0" readOnly />
                          <button type='button' className="h-full w-10 flex justify-center items-center cursor-pointer" onClick={() => dispatch(increaseQuantity({productId: product.productId, variantId: product.variantId}))}>
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                    </td>

                    <td className='md:table-cell justify-between flex md:p-3 px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium'>Total</span>
                      <span>{(product.sellingPrice * product.qty).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>

                    </td>
                    <td className='md:table-cell justify-between flex md:p-3 px-3 pb-2 text-center'>
                      <span className='md:hidden font-medium'>Remove</span>
                      <button type='button' className='text-red-500 mt-1' onClick={() => dispatch(removeFromCart({
                        productId: product.productId, variantId: product.variantId
                      }))}>
                        <IoCloseCircleOutline />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='lg:w-[30%] w-full'>

            <div className='rounded bg-gray-50 p-5 sticky top-5'>
              <h4 className='text-lg font-semibold mb-5'>Order Summary</h4>
              <div>
                <table className='w-full'>
                  <tbody>
                    <tr>
                      <td className='font-medium py-2'>
                        Subtotal
                      </td>
                      <td className='text-end py-2'>
{subtotal.toLocaleString('en-IN',{style:'currency',currency:'INR'})}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>
                        Discount
                      </td>
                      <td className='text-end py-2'>
- {discount.toLocaleString('en-IN',{style:'currency',currency:'INR'})}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>
                        GST / Tax (18%)
                      </td>
                      <td className='text-end py-2'>
{taxAmount.toLocaleString('en-IN',{style:'currency',currency:'INR'})}
                      </td>
                    </tr>
                    <tr>
                      <td className='font-medium py-2'>
                        Total
                      </td>
                      <td className='text-end py-2'>
{totalAmount.toLocaleString('en-IN',{style:'currency',currency:'INR'})}
                      </td>
                    </tr>
                  </tbody>
                </table>
<Button type='button' asChild className='w-full bg-black rounded-full mt-5 mb-3'>
  <Link href={WEBSITE_CHECKOUT}>Proceed To Checkout</Link>
</Button>
<p className='text-center'>
  <Link href={WEBSITE_SHOP} className='hover:underline'>Continue Shopping</Link>
</p>

              </div>
            </div>
          </div>
        </div>

      }
    </div>
  )
}

export default CartPage
