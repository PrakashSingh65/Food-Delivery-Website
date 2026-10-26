import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Categories from '../Category'
import Card from '../Components/Card'
import Hero from '../Components/Hero'
import StatsBar from '../Components/StatsBar'
import WhyUs from '../Components/WhyUs'
import Footer from '../Components/Footer'
import { food_items } from '../Food'
import { useGetRestaurantsQuery } from '../redux/api/restaurantApi'
import { FiStar, FiClock, FiMapPin, FiArrowRight } from 'react-icons/fi'

const Home = () => {
  const [cate, setCate] = useState(food_items)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchText, setSearchText] = useState('')
  const menuRef = useRef(null)

  // Fetch real restaurants from Node.js backend
  const { data: restaurantResponse, isLoading: isRestLoading } = useGetRestaurantsQuery()
  const restaurants = restaurantResponse?.data?.restaurants || []

  function filter(category) {
    setActiveCategory(category)
    setSearchText('')
    const categoryLower = category.toLowerCase()
    if (categoryLower === 'all') {
      setCate(food_items)
    } else {
      setCate(food_items.filter((item) => item.food_category === categoryLower))
    }
  }

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const displayedItems = searchText.trim()
    ? cate.filter((item) =>
        item.food_name.toLowerCase().includes(searchText.toLowerCase())
      )
    : cate

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <Hero onExplore={scrollToMenu} />

      {/* Stats Bar */}
      <StatsBar />

      {/* Featured Restaurants from Real Backend */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
              Live Backend Synchronized
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">
              Popular Restaurants Near You 🛵
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Handpicked dining partners ready to prepare and deliver hot meals
            </p>
          </div>
        </div>

        {isRestLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {restaurants.map((rest) => (
              <Link
                key={rest._id}
                to={`/restaurant/${rest._id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col"
              >
                <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                  <img
                    src={rest.imageUrl}
                    alt={rest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-xs font-bold text-gray-900 flex items-center gap-1 shadow-xs">
                    <FiStar className="text-yellow-400 fill-yellow-400" />
                    {rest.rating}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1">
                    <FiClock size={12} className="text-orange-400" />
                    {rest.deliveryTimeMin} mins
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-500 transition">
                      {rest.name}
                    </h3>
                    <p className="text-xs text-orange-600 font-bold mt-1">
                      {rest.cuisineTypes.join(', ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {rest.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-orange-500" />
                      {rest.address.city}
                    </span>
                    <span className="font-bold text-orange-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Menu <FiArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Menu Section */}
      <section ref={menuRef} className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-500">
            Our Dishes
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">
            What's on Your Mind? 🤔
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto text-base">
            Pick a category and dig in — everything's made fresh, delivered fast.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Categories.map((item) => (
            <button
              key={item.id}
              onClick={() => filter(item.name)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === item.name
                  ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-500/30 scale-105'
                  : 'bg-white text-gray-600 hover:text-orange-500 hover:shadow-xs border border-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedItems.map((item) => (
            <Card
              key={item.id}
              name={item.food_name}
              image={item.food_image}
              price={item.price}
              id={item.id}
              type={item.food_type}
            />
          ))}
        </div>
      </section>

      {/* Why Us */}
      <WhyUs />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
