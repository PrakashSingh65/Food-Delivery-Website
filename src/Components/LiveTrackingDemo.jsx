import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  connectSocket,
  disconnectSocket,
  joinOrderRoom,
  leaveOrderRoom,
  emitDeliveryLocation,
} from '../redux/middleware/socketMiddleware';
import { useGetOrderTrackingDetailsQuery } from '../redux/api/trackingApi';
import { FiCheckCircle, FiTruck, FiClock, FiMapPin, FiNavigation } from 'react-icons/fi';

const ORDER_STEPS = [
  { key: 'PENDING', label: 'Order Placed' },
  { key: 'ACCEPTED', label: 'Accepted by Restaurant' },
  { key: 'PREPARING', label: 'Food is Being Prepared' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { key: 'DELIVERED', label: 'Delivered' },
];

export const LiveTrackingDemo = ({ orderId = 'FD-20261026-8842' }) => {
  const dispatch = useDispatch();
  const trackingState = useSelector((state) => state.tracking);
  const { data: apiData, isLoading } = useGetOrderTrackingDetailsQuery(orderId, {
    skip: !orderId,
  });

  useEffect(() => {
    // 1. Connect socket on mount
    dispatch(connectSocket());

    if (orderId) {
      // 2. Join the dedicated order room
      dispatch(joinOrderRoom(orderId));
    }

    return () => {
      if (orderId) {
        dispatch(leaveOrderRoom(orderId));
      }
      dispatch(disconnectSocket());
    };
  }, [dispatch, orderId]);

  const currentStatusIndex = ORDER_STEPS.findIndex((s) => s.key === trackingState.status);

  // Helper for delivery partner simulation
  const simulatePartnerMovement = () => {
    const currentLat = trackingState.partnerLocation?.latitude || 12.9554;
    const currentLng = trackingState.partnerLocation?.longitude || 77.6521;
    const nextLat = currentLat + (Math.random() - 0.5) * 0.002;
    const nextLng = currentLng + (Math.random() - 0.5) * 0.002;

    dispatch(
      emitDeliveryLocation({
        orderId,
        lat: Number(nextLat.toFixed(5)),
        lng: Number(nextLng.toFixed(5)),
        speed: 28,
        heading: 90,
      })
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-4xl mx-auto my-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
            Live Order Tracking
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-2">
            Order #{trackingState.orderNumber || orderId}
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl font-medium text-sm">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          Real-time WebSocket Sync
        </div>
      </div>

      {/* Lifecycle Progress Bar */}
      <div className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ORDER_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg mb-2 transition-all ${
                    isCompleted
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                      : 'bg-gray-100 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-orange-200 scale-110' : ''}`}
                >
                  {isCompleted ? <FiCheckCircle size={22} /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-bold leading-tight ${
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Telemetry and Partner Live Coordinates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <FiTruck size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Delivery Partner</p>
            <p className="text-sm font-bold text-gray-900">
              {trackingState.partnerLocation ? 'Vikram Singh (Bike)' : 'Assigning Partner...'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Lat: {trackingState.partnerLocation?.latitude?.toFixed(4) || '12.9554'}, Lng:{' '}
              {trackingState.partnerLocation?.longitude?.toFixed(4) || '77.6521'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FiClock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Estimated Arrival</p>
            <p className="text-sm font-bold text-gray-900">18 - 25 mins</p>
            <p className="text-xs text-gray-400 mt-1">
              Distance: {trackingState.remainingDistanceKm || '2.4'} km
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <FiMapPin size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Destination</p>
            <p className="text-sm font-bold text-gray-900">Bellandur, Bengaluru</p>
            <p className="text-xs text-gray-400 mt-1">Flat 402, Green Glen Layout</p>
          </div>
        </div>
      </div>

      {/* Live Simulation Controls */}
      <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
        <button
          onClick={simulatePartnerMovement}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md"
        >
          <FiNavigation size={16} />
          Simulate Partner Coordinate Emit
        </button>
        <span className="text-xs text-gray-500 italic">
          Last socket packet: {trackingState.partnerLocation?.updatedAt || 'Synced'}
        </span>
      </div>
    </div>
  );
};

export default LiveTrackingDemo;
