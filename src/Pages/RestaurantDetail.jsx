import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetRestaurantByIdQuery, useToggleMenuItemAvailabilityMutation } from '../redux/api/restaurantApi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import { toast } from 'react-toastify'
import { FiStar, FiClock, FiMapPin, FiArrowLeft, FiPlus, FiCheck } from 'react-icons/fi'
import { LuLeafyGreen } from 'react-icons/lu'
import { GiMeat } from 'react-icons/gi'

const RestaurantDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { data: resData, isLoading, error } = useGetRestaurantByIdQuery(id)
  const [toggleStock] = useToggleMenuItemAvailabilityMutation()
  const [vegOnly, setVegOnly] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ALL')

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading restaurant menu from server...</p>
        </div>
      </div>
    )
  }

  if (error || !resData?.data?.restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h2>
        <p className="text-gray-500 mb-6">The requested restaurant profile could not be loaded.</p>
        <Link to="/" className="bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl">
          Back to Home
        </Link>
      </div>
    )
  }

  const { restaurant, menu } = resData.data
  const categories = Object.keys(menu)
  const isOwnerOrAdmin = user && (user.role === 'admin' || user._id === restaurant.ownerId)

  const handleAddToCart = (item) => {
    if (!item.isAvailable) {
      toast.error('This item is currently out of stock')
      return
    }

    dispatch(
      addToCart({
        id: item._id,
        _id: item._id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        isVeg: item.isVeg,
      })
    )
    toast.success(`Added ${item.name} to cart!`)
  }

  const handleToggleStock = async (itemId) => {
    try {
      await toggleStock({ restaurantId: restaurant._id, itemId }).unwrap()
      toast.info('Item availability updated!')
    } catch (err) {
      toast.error('Failed to update availability')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-orange-500 mb-6 transition"
        >
          <FiArrowLeft /> Back to Restaurants
        </Link>

        {/* Restaurant Header Banner Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-10">
          <div className="h-64 sm:h-80 w-full relative">
            <img
              src={restaurant.bannerUrl || restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-orange-500 text-white px-3 py-1 rounded-full mb-2 inline-block">
                  {restaurant.cuisineTypes.join(' • ')}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black">{restaurant.name}</h1>
                <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
                  <FiMapPin size={14} className="text-orange-400" />
                  {restaurant.address.street}, {restaurant.address.city}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-1.5 font-bold">
                  <FiStar className="text-yellow-400 fill-yellow-400" />
                  <span>{restaurant.rating}</span>
                  <span className="text-xs text-white/70">({restaurant.totalRatings}+)</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-1.5 font-bold">
                  <FiClock className="text-orange-300" />
                  <span>{restaurant.deliveryTimeMin} mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeCategory === 'ALL'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat} ({menu[cat].length})
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold select-none">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <LuLeafyGreen className="text-emerald-600" /> Pure Veg Only
          </label>
        </div>

        {/* Category-Wise Menu Sections */}
        <div className="space-y-12">
          {categories
            .filter((cat) => activeCategory === 'ALL' || activeCategory === cat)
            .map((cat) => {
              const items = vegOnly ? menu[cat].filter((i) => i.isVeg) : menu[cat]
              if (items.length === 0) return null

              return (
                <div key={cat} className="space-y-4">
                  <h3 className="text-2xl font-black text-gray-900 border-b border-gray-200 pb-3 flex items-center gap-2">
                    {cat}
                    <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className={`bg-white rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                          item.isAvailable
                            ? 'border-gray-100 shadow-xs hover:shadow-md'
                            : 'border-gray-200 opacity-60 bg-gray-50/50'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative">
                            <img
                              src={item.imageUrl || restaurant.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <span
                              className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                                item.isVeg
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}
                            >
                              {item.isVeg ? <LuLeafyGreen size={12} /> : <GiMeat size={12} />}
                            </span>
                          </div>

                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-base leading-snug">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-base font-black text-gray-900 mt-2">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span
                            className={`text-[11px] font-bold uppercase tracking-wider ${
                              item.isAvailable ? 'text-emerald-600' : 'text-red-500'
                            }`}
                          >
                            {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </span>

                          <div className="flex items-center gap-2">
                            {isOwnerOrAdmin && (
                              <button
                                onClick={() => handleToggleStock(item._id)}
                                className="text-[11px] font-bold text-gray-600 hover:text-black bg-gray-100 px-2 py-1 rounded-lg"
                              >
                                Toggle Stock
                              </button>
                            )}

                            <button
                              disabled={!item.isAvailable}
                              onClick={() => handleAddToCart(item)}
                              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              <FiPlus /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetail
