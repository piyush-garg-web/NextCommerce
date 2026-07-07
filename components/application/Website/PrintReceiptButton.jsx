'use client'
import React from 'react'
import CustomButton from '../CustomButton'
import { FaPrint } from 'react-icons/fa'
import Image from 'next/image'
import logo from '@/public/assets/images/logo-black.png'

const PrintReceiptButton = ({
  orderData,
  className = '',
  wrapperClassName = 'mt-4',
  showButton = true,
  showReceipt = true,
}) => {
  const productsSubtotal = orderData?.product?.reduce(
    (sum, product) => sum + ((product?.sellingPrice || 0) * (product?.qty || 0)),
    0
  ) || 0
  const productsDiscount = orderData?.product?.reduce(
    (sum, product) => sum + (((product?.mrp || product?.sellingPrice || 0) - (product?.sellingPrice || 0)) * (product?.qty || 0)),
    0
  ) || 0
  const receiptSubtotal = productsSubtotal || orderData?.subtotal || 0
  const receiptDiscount = productsDiscount || orderData?.discount || 0
  const receiptCouponDiscount = orderData?.couponDiscountAmount || 0
  const receiptTaxableAmount = Math.max(receiptSubtotal - receiptDiscount - receiptCouponDiscount, 0)
  const receiptTaxAmount = Number((receiptTaxableAmount * 0.18).toFixed(2))
  const receiptTotalAmount = Number((receiptTaxableAmount + receiptTaxAmount).toFixed(2))

  const handlePrint = () => {
    const currentTitle = document.title
    document.title = ' '
    window.print()
    setTimeout(() => {
      document.title = currentTitle
    }, 500)
  }

  return (
    <div className={wrapperClassName}>
      {showButton && (
        <CustomButton
          text="Print Receipt"
          className={`w-fit min-w-40 rounded-full px-6 py-3 text-md flex items-center justify-center gap-2 cursor-pointer ${className}`}
          onClick={handlePrint}
        >
          <FaPrint size={16} />
        </CustomButton>
      )}

      {/* Hidden print-only section with receipt details */}
      {showReceipt && (
        <div className="print-only hidden">
        <div className="px-8 py-6 max-w-4xl mx-auto text-sm">
          <div className="mb-5 flex items-center">
            <Image
              src={logo}
              width={383}
              height={146}
              alt="E-store"
              className="w-32 h-auto"
              priority
            />
          </div>

          {/* Order Info */}
          <div className="mb-6">
            <p><b>Order Id :</b> {orderData?.order_id}</p>
            <p><b>Transaction Id :</b> {orderData?.payment_id}</p>
            <p><b>Date & Time :</b> {new Date(orderData?.createdAt || Date.now()).toLocaleString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          {/* Products */}
          <div className="mb-6">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-3 py-2 text-left">Product</th>
                  <th className="border px-3 py-2 text-center">Price</th>
                  <th className="border px-3 py-2 text-center">Quantity</th>
                  <th className="border px-3 py-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData?.product?.map((product) => (
                  <tr key={product?.variantId?._id}>
                    <td className="border px-3 py-2">
                      <p className="font-medium">{product?.productId?.name}</p>
                      <p className="text-sm text-gray-600">Product Id : {product?.productId?._id}</p>
                      <p className="text-sm text-gray-600">
                        Color : {product?.variantId?.color}
                      </p>
                      <p className="text-sm text-gray-600">
                        Size : {product?.variantId?.size}
                      </p>
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {(product?.sellingPrice || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                    <td className="border px-3 py-2 text-center">{product?.qty}</td>
                    <td className="border px-3 py-2 text-center">
                      {((product?.qty || 0) * (product?.sellingPrice || 0)).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1">Subtotal</td>
                  <td className="py-1 text-right">{receiptSubtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                </tr>
                <tr>
                  <td className="py-1">Discount</td>
                  <td className="py-1 text-right">- {receiptDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                </tr>
                {receiptCouponDiscount > 0 && (
                  <tr>
                    <td className="py-1">Coupon Discount</td>
                    <td className="py-1 text-right">- {receiptCouponDiscount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-1">GST / Tax (18%)</td>
                  <td className="py-1 text-right">{receiptTaxAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                </tr>
                <tr className="font-semibold border-t">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right">{receiptTotalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 border-t pt-6 max-w-sm">
            <Image
              src={logo}
              width={383}
              height={146}
              alt="E-store"
              className="w-32 h-auto mb-3"
              priority
            />
            <p className="text-gray-600 leading-6">
              E-store is your trusted destination for quality and convenience.
              From fashion to essentials, we bring everything you need right to
              your doorstep. Shop smart, live better - only at E-store.
            </p>
          </div>
        </div>
      </div>
      )}

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          header,
          footer {
            display: none !important;
          }
          .print-only {
            display: block !important;
            width: 100%;
            background: white;
          }
        }
      `}</style>
    </div>
  )
}

export default PrintReceiptButton
