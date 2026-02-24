import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeFromCart, increaseQty, decreaseQty } from '../redux/cartSlice'
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi'
import { MdOutlineShoppingCartCheckout } from 'react-icons/md'
import { toast } from 'react-toastify'

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.error(`${name} removed from cart`);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center mb-8">
          <span className="text-8xl">🛒</span>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 max-w-md mb-8">
          Looks like you haven't added anything to your cart yet. Explore our delicious menu and find something you'll love!
        </p>
        <Link 
          to="/"
          className="bg-linear-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-orange-300 hover:scale-105 transition-all duration-300"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:text-orange-500 transition shadow-sm">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-4xl font-black text-gray-900">Your Shopping Cart</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1 flex flex-col gap-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-400 capitalize mb-4">{item.type.replace('_', ' ')}</p>
                <p className="text-lg font-black text-orange-500">₹{item.price}</p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-4">
                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2 border border-gray-200">
                  <button 
                    onClick={() => dispatch(decreaseQty(item.id))}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:text-orange-500 hover:shadow-sm transition"
                  >
                    <FiMinus />
                  </button>
                  <span className="text-lg font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(increaseQty(item.id))}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:text-orange-500 hover:shadow-sm transition"
                  >
                    <FiPlus />
                  </button>
                </div>
                
                <button 
                  onClick={() => handleRemove(item.id, item.name)}
                  className="flex items-center gap-2 text-red-500 text-sm font-bold hover:text-red-600 transition"
                >
                  <FiTrash2 /> Remove item
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 sticky top-28">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>
            
            <div className="flex flex-col gap-4 text-gray-500 font-medium mb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-green-500">
                <span>Delivery Fee</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST 5%)</span>
                <span className="text-gray-900">₹{Math.round(totalPrice * 0.05)}</span>
              </div>
              
              <div className="h-px bg-gray-100 my-2" />
              
              <div className="flex justify-between text-xl font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-orange-500">₹{totalPrice + Math.round(totalPrice * 0.05)}</span>
              </div>
            </div>
            
            <button className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
              <MdOutlineShoppingCartCheckout size={24} />
              Proceed to Checkout
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
              By proceeding you agree to our Terms & Conditions. All items are prepared fresh on order.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
