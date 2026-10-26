import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, increaseQty, decreaseQty, applyCoupon, removeCoupon, clearCart } from '../redux/cartSlice'
import { useCreateOrderMutation } from '../redux/api/orderApi'
import { useValidateCouponMutation } from '../redux/api/couponApi'
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiTag, FiCheckCircle } from 'react-icons/fi'
import { MdOutlineShoppingCartCheckout } from 'react-icons/md'
import { toast } from 'react-toastify'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)
  const currentCoupon = useSelector((state) => state.cart.coupon)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const [couponCode, setCouponCode] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    postalCode: '560103',
    latitude: 12.9279,
    longitude: 77.6713,
  })

  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation()
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation()

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryFee = subtotal >= 500 || subtotal === 0 ? 0 : 30
  const discount = currentCoupon?.discount || 0
  const discountedSubtotal = Math.max(0, subtotal - discount)
  const taxes = Math.round(discountedSubtotal * 0.05)
  const platformFee = cartItems.length > 0 ? 5 : 0
  const grandTotal = discountedSubtotal + deliveryFee + taxes + platformFee

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id))
    toast.error(`${name} removed from cart`)
  }

  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    try {
      const res = await validateCoupon({
        code: couponCode.trim().toUpperCase(),
        subtotal,
      }).unwrap()

      if (res.success && res.data) {
        dispatch(applyCoupon(res.data))
        toast.success(`Coupon applied! You saved ₹${res.data.discount}`)
        setCouponCode('')
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Invalid or expired coupon')
    }
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.warn('Please log in to place your order')
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Default restaurant fallback if items were added from legacy mock
    const restaurantId =
      cartItems[0]?.restaurantId || '6adf015f3bbf5200097f9170'

    // Map items to backend order format
    const formattedItems = cartItems.map((item) => ({
      menuItemId: item._id || item.id || '6adf015f3bbf5200097f9176',
      quantity: item.quantity,
    }))

    try {
      const payload = {
        restaurantId,
        items: formattedItems,
        couponCode: currentCoupon?.couponCode || undefined,
        paymentMethod: 'UPI',
        deliveryAddress,
      }

      const res = await createOrder(payload).unwrap()
      if (res.success && res.data?.order) {
        toast.success('Order placed successfully!')
        dispatch(clearCart())
        navigate(`/track/${res.data.order._id}`)
      }
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to place order')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center pt-24">
        <div className="w-56 h-56 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-7xl">🛒</span>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 max-w-md mb-8 text-sm">
          Looks like you haven't added anything to your cart yet. Explore our delicious menus and order fresh food!
        </p>
        <Link
          to="/"
          className="bg-linear-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 hover:scale-105 transition-all"
        >
          Explore Restaurants
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-orange-500 transition shadow-xs"
        >
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Your Shopping Cart</h1>
          <p className="text-xs text-gray-400 mt-0.5">Authoritative pricing synced with backend</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id || item._id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-gray-100"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">{item.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">₹{item.price} each</p>
                  <p className="text-sm font-black text-orange-600 mt-1">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => dispatch(decreaseQty(item.id || item._id))}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-orange-500 shadow-xs"
                  >
                    <FiMinus size={12} />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => dispatch(increaseQty(item.id || item._id))}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:text-orange-500 shadow-xs"
                  >
                    <FiPlus size={12} />
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.id || item._id, item.name)}
                  className="w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* Delivery Address Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs mt-6">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Delivery Address</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={deliveryAddress.street}
                  onChange={(e) =>
                    setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">City</label>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) =>
                    setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none font-medium text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Pricing Engine */}
        <div className="w-full lg:w-96 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FiTag className="text-orange-500" /> Apply Coupon
            </h4>
            {currentCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <div>
                  <span className="font-bold text-emerald-800 text-xs">
                    {currentCoupon.couponCode}
                  </span>
                  <p className="text-[11px] text-emerald-600">Saved ₹{currentCoupon.discount}</p>
                </div>
                <button
                  onClick={() => dispatch(removeCoupon())}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME50, FLAT100"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase font-bold outline-none focus:bg-white focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  className="bg-gray-900 text-white font-bold text-xs px-4 py-2 rounded-xl disabled:opacity-50 hover:bg-black transition cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
            <div className="mt-2 flex gap-1.5 flex-wrap">
              {['WELCOME50', 'FLAT100', 'FREEDEL'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCouponCode(code)}
                  className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 hover:bg-orange-100"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-3">
            <h4 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">
              Bill Details
            </h4>

            <div className="flex justify-between text-xs text-gray-600">
              <span>Item Total</span>
              <span className="font-bold text-gray-900">₹{subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                <span>Coupon Discount ({currentCoupon?.couponCode})</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-600">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase text-[10px]">FREE</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>GST & Restaurant Taxes (5%)</span>
              <span>₹{taxes}</span>
            </div>

            <div className="flex justify-between text-xs text-gray-600">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-base font-black text-gray-900">
              <span>To Pay</span>
              <span className="text-xl text-orange-600">₹{grandTotal}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCreatingOrder}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer text-sm"
            >
              <MdOutlineShoppingCartCheckout size={18} />
              {isCreatingOrder ? 'Creating Order on Backend...' : 'Place Order & Track Live'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
