import React from 'react'
import { Link } from 'react-router-dom'
import { useGetMyOrdersQuery } from '../redux/api/orderApi'
import { FiClock, FiMapPin, FiNavigation, FiArrowRight } from 'react-icons/fi'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800 animate-pulse',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const Orders = () => {
  const { data: resData, isLoading, error } = useGetMyOrdersQuery()
  const orders = resData?.data?.orders || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
            Real Database Sync
          </span>
          <h1 className="text-3xl font-black text-gray-900 mt-2">Your Orders</h1>
          <p className="text-gray-400 text-xs mt-1">
            Track past and active food delivery orders in real time
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-xl font-bold text-gray-800">No Orders Found</h3>
            <p className="text-gray-400 text-xs mt-1 mb-6">
              You haven't placed any orders yet. Check out our delicious restaurants!
            </p>
            <Link to="/" className="bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col md:flex-row justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-gray-900">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 font-medium">
                    From:{' '}
                    <span className="font-bold text-gray-900">
                      {order.restaurantId?.name || 'Partner Restaurant'}
                    </span>
                  </p>

                  <div className="text-xs text-gray-400">
                    {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <FiMapPin className="text-orange-500" />
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </div>
                </div>

                <div className="flex md:flex-col justify-between md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Paid</p>
                    <p className="text-xl font-black text-gray-900">
                      ₹{order.priceBreakdown?.grandTotal}
                    </p>
                  </div>

                  <Link
                    to={`/track/${order._id}`}
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs"
                  >
                    <FiNavigation size={14} className="text-orange-400" />
                    Live Track <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
