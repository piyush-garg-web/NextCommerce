'use client'
import React from 'react'
import CustomButton from '../CustomButton'
import { FaPrint } from 'react-icons/fa'

const PrintReceiptButton = ({ orderData }) => {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="mt-8">
      <CustomButton
        text="Print Receipt"
        className="w-full md:w-auto flex items-center gap-2 bg-black hover:bg-gray-80 text-white rounded-full px-8 py-3 cursor-pointer"
        onClick={handlePrint}
      >
        <FaPrint size={16} />
      </CustomButton>

      {/* Hidden print-only section with full receipt details */}
      <div className="print-only hidden">
        <div className="p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold mb-2">E-Store</h1>
            <p className="text-gray-600">Order Receipt</p>
          </div>

          {/* Order Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Order Information</h2>
            <p><b>Order ID:</b> {orderData?.order_id}</p>
            <p><b>Transaction ID:</b> {orderData?.payment_id}</p>
            <p><b>Status:</b> {orderData?.status}</p>
            <p><b>Date:</b> {new Date(orderData?.createdAt || Date.now()).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          {/* Products */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Products</h2>
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
                  <tr key={product.variantId._id}>
                    <td className="border px-3 py-2">
                      <p className="font-medium">{product.productId.name}</p>
                      <p className="text-sm text-gray-600">
                        Color: {product.variantId.color}, Size: {product.variantId.size}
                      </p>
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                    <td className="border px-3 py-2 text-center">{product.qty}</td>
                    <td className="border px-3 py-2 text-center">
                      {(product.qty * product.sellingPrice).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
            <p>{orderData?.name}</p>
            <p>{orderData?.email}</p>
            <p>{orderData?.phone}</p>
            <p>{orderData?.landmark ? `${orderData?.landmark}, ` : ''}{orderData?.city}, {orderData?.state}</p>
            <p>{orderData?.country} - {orderData?.pincode}</p>
            {orderData?.ordernote && <p><b>Note:</b> {orderData.ordernote}</p>}
          </div>

          {/* Order Summary */}
          <div className="mb-6 border-t pt-4">
            <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-1">Subtotal</td>
                  <td className="py-1 text-right">{orderData?.subtotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                </tr>
                <tr>
                  <td className="py-1">Discount</td>
                  <td className="py-1 text-right">- {orderData?.discount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                </tr>
                {orderData?.couponDiscountAmount > 0 && (
                  <tr>
                    <td className="py-1">Coupon Discount</td>
                    <td className="py-1 text-right">- {orderData?.couponDiscountAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                  </tr>
                )}
                <tr className="font-semibold border-t">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right">{orderData?.totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 border-t pt-4 text-gray-600">
            <p>Thank you for shopping with us!</p>
            <p>For any queries, please contact support.</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print-only {
            display: block !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default PrintReceiptButton
