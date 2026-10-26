import React from 'react'
import { useParams, Link } from 'react-router-dom'
import LiveTrackingDemo from '../Components/LiveTrackingDemo'
import { useUpdateOrderStatusMutation } from '../redux/api/orderApi'
import { useSelector } from 'react-redux'
import { FiArrowLeft, FiPlay } from 'react-icons/fi'
import { toast } from 'react-toastify'

const ORDER_STATUS_CYCLE = ['PENDING', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

const LiveTracking = () => {
  const { id } = useParams()
  // Fallback to demo active order ID seeded in DB if no ID provided
  const activeOrderId = id || '6adf015f3bbf5200097f9192'
  const trackingState = useSelector((state) => state.tracking)
  const { user } = useSelector((state) => state.auth)
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation()

  const handleNextStatus = async () => {
    const currentStatus = trackingState.status || 'PENDING'
    const currentIndex = ORDER_STATUS_CYCLE.indexOf(currentStatus)
    if (currentIndex < ORDER_STATUS_CYCLE.length - 1) {
      const nextStatus = ORDER_STATUS_CYCLE[currentIndex + 1]
      try {
        await updateStatus({
          orderId: activeOrderId,
          status: nextStatus,
          note: `Simulated lifecycle advance by ${user?.name || 'Tester'}`,
        }).unwrap()
        toast.success(`Advanced status to: ${nextStatus}`)
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to update order status')
      }
    } else {
      toast.info('Order has already reached DELIVERED state!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-500 transition"
          >
            <FiArrowLeft /> Back to Orders
          </Link>

          {/* Quick Lifecycle Advance Button for Testing */}
          <button
            onClick={handleNextStatus}
            disabled={isUpdatingStatus}
            className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <FiPlay size={14} />
            Advance Lifecycle ({trackingState.status} → Next)
          </button>
        </div>

        {/* Live Tracking Interactive Component */}
        <LiveTrackingDemo orderId={activeOrderId} />
      </div>
    </div>
  )
}

export default LiveTracking
