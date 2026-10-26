import React, { useContext, useState, useEffect } from 'react'
import { MdFastfood } from 'react-icons/md'
import { IoSearch } from 'react-icons/io5'
import { FaBagShopping } from 'react-icons/fa6'
import { FiUser, FiLogOut, FiMapPin, FiClock } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { dataContext } from '../Context/UserContext'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import { toast } from 'react-toastify'

const Nav = () => {
  const { input, setInput } = useContext(dataContext)
  const cartItems = useSelector((state) => state.cart.items)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [scrolled, setScrolled] = useState(false)

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    toast.info('Logged out successfully')
  }

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
            <MdFastfood className="text-white text-xl" />
          </div>
          <span className="text-xl font-black text-gray-800 hidden sm:block">
            Food<span className="text-orange-500">Rush</span>
          </span>
        </Link>

        {/* Search */}
        <form
          className="flex-1 max-w-md flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 shadow-xs focus-within:bg-white focus-within:border-orange-400 transition"
          onSubmit={(e) => e.preventDefault()}
        >
          <IoSearch className="text-orange-400 text-lg shrink-0" />
          <input
            type="text"
            placeholder="Search restaurants, cuisines, dishes…"
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>

        {/* Right Nav Navigation */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/orders"
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-orange-600 bg-gray-100 hover:bg-orange-50 px-3 py-2 rounded-xl transition"
              >
                <FiClock size={14} />
                Orders
              </Link>
              <Link
                to="/track"
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition"
              >
                <FiMapPin size={14} />
                Live GPS
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-tight">{user.name}</p>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="w-9 h-9 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl flex items-center justify-center transition"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 hover:text-orange-500 px-3 py-1.5 rounded-lg transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hidden sm:flex items-center text-sm font-bold bg-linear-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative w-11 h-11 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-xs cursor-pointer hover:border-orange-400 hover:shadow-md transition-all group"
          >
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-black group-hover:scale-110 transition-transform shadow-xs">
              {cartCount}
            </span>
            <FaBagShopping className="text-orange-500 text-lg group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Nav
