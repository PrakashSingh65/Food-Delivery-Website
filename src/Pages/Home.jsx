import React, { useState, useContext, useRef } from 'react'
import Categories from '../Category'
import Card from '../Components/Card'
import Hero from '../Components/Hero'
import StatsBar from '../Components/StatsBar'
import WhyUs from '../Components/WhyUs'
import Footer from '../Components/Footer'
import { food_items } from '../Food'
import { dataContext } from '../Context/UserContext'

const Home = () => {
  const [cate, setCate] = useState(food_items)
  const [activeCategory, setActiveCategory] = useState('All')
  const { input } = useContext(dataContext)
  const menuRef = useRef(null)

  function filter(category) {
    setActiveCategory(category)
    const categoryLower = category.toLowerCase()
    if (categoryLower === 'all') {
      setCate(food_items)
    } else {
      setCate(food_items.filter(item => item.food_category === categoryLower))
    }
  }

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Filter by search input
  const displayedItems = input.trim()
    ? cate.filter(item =>
        item.food_name.toLowerCase().includes(input.toLowerCase())
      )
    : cate

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <Hero onExplore={scrollToMenu} />

      {/* Stats Bar */}
      <StatsBar />

      {/* Menu Section */}
      <section ref={menuRef} className="max-w-7xl mx-auto px-6 md:px-12 py-20">

        {/* Section heading */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-500">Our Menu</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">
            What's on Your Mind? 🤔
          </h2>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto text-base">
            Pick a category and dig in — everything's made fresh, delivered fast.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Categories.map(item => (
            <button
              key={item.id}
              onClick={() => {
                filter(item.name)
                scrollToMenu()
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 border-2 ${
                activeCategory === item.name
                  ? 'bg-linear-to-r from-orange-500 to-red-500 text-white border-transparent shadow-lg scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="capitalize">{item.name.replace('_', ' ')}</span>
            </button>
          ))}
        </div>

        {/* Results heading */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-bold text-gray-800">{displayedItems.length}</span> items
            {input ? ` for "${input}"` : ` in `}
            {!input && <span className="font-bold text-orange-500"> {activeCategory.replace('_', ' ')}</span>}
          </p>
        </div>

        {/* Food Grid */}
        {displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-7xl">🍽️</span>
            <h3 className="text-2xl font-bold text-gray-700">No dishes found</h3>
            <p className="text-gray-400">Try a different category or search term.</p>
            <button
              onClick={() => filter('All')}
              className="mt-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Show All Items
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {displayedItems.map(item => (
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
        )}
      </section>

      {/* Why Us */}
      <WhyUs />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
