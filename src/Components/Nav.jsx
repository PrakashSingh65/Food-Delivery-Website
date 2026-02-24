import React, { useContext, useState, useEffect } from 'react'
import { MdFastfood } from 'react-icons/md'
import { IoSearch } from 'react-icons/io5'
import { FaBagShopping } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { dataContext } from '../Context/UserContext'
import { useSelector } from 'react-redux'

const Nav = () => {
  const { input, setInput } = useContext(dataContext)
  const cartItems = useSelector((state) => state.cart.items)
  const [scrolled, setScrolled] = useState(false)

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
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
          className="flex-1 max-w-md flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm"
          onSubmit={e => e.preventDefault()}
        >
          <IoSearch className="text-orange-400 text-lg shrink-0" />
          <input
            type="text"
            placeholder="Search dishes…"
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Auth links */}
          <Link
            to="/login"
            className="hidden md:block text-sm font-semibold text-gray-600 hover:text-orange-500 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="hidden md:flex items-center text-sm font-bold bg-linear-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition shadow-sm"
          >
            Sign Up
          </Link>

          {/* Cart */}
          <Link 
            to="/cart"
            className="relative w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:border-orange-400 hover:shadow-md transition-all group"
          >
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-linear-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-[11px] font-black group-hover:scale-110 transition-transform shadow-sm">
              {cartCount}
            </span>
            <FaBagShopping className="text-orange-500 text-xl group-hover:scale-110 transition-transform" />
          </Link>
        </div>

      </div>
    </nav>
  )
}

export default Nav