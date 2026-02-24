import React, { useContext, useState, useEffect } from 'react'
import { dataContext } from '../Context/UserContext'
import { IoSearch } from 'react-icons/io5'
import { MdDeliveryDining } from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi2'
import { food_items } from '../Food'

// Pick 3 popular featured dishes
const featured = [food_items[7], food_items[8], food_items[3]] // Biryani, Pizza, Pasta

const Hero = ({ onExplore }) => {
  const { input, setInput } = useContext(dataContext)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveImg(p => (p + 1) % featured.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-linear-to-br from-orange-50 via-amber-50 to-green-50 min-h-[92vh] flex items-center">

      {/* Decorative blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-orange-300 opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] rounded-full bg-green-400 opacity-20 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-center gap-12">

        {/* Left – Text */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-2 rounded-full w-fit shadow-sm">
            <MdDeliveryDining className="text-xl" />
            Free delivery on orders above ₹499
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            Delicious Food,{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-500">
              Delivered Fast
            </span>{' '}
            🍽️
          </h1>

          <p className="text-lg text-gray-500 max-w-md leading-relaxed">
            From sizzling curries to wood-fired pizzas — explore hundreds of
            fresh dishes prepared by top chefs and delivered hot to your door
            in under 30 minutes.
          </p>

          {/* Search bar */}
          <form
            className="flex items-center gap-3 bg-white rounded-2xl shadow-lg px-5 py-3 max-w-lg border border-orange-100"
            onSubmit={e => e.preventDefault()}
          >
            <IoSearch className="text-orange-400 text-2xl shrink-0" />
            <input
              type="text"
              placeholder="Search for pizza, biryani, burger…"
              className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              onClick={onExplore}
              className="bg-linear-to-r from-orange-500 to-red-500 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:opacity-90 transition"
            >
              Search
            </button>
          </form>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onExplore}
              className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-orange-300 hover:scale-105 transition-all duration-300 text-base"
            >
              <HiSparkles /> Order Now
            </button>
            <button
              onClick={onExplore}
              className="flex items-center gap-2 border-2 border-orange-400 text-orange-600 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all duration-300 text-base"
            >
              Explore Menu
            </button>
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            {[
              { label: 'Happy Customers', value: '50K+' },
              { label: 'Menu Items', value: '200+' },
              { label: 'Delivery Time', value: '~28 min' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right – Rotating food card */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative w-[340px] h-[420px]">
            {featured.map((item, i) => (
              <div
                key={item.id}
                className={`absolute inset-0 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ${
                  i === activeImg
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-95 z-0'
                }`}
              >
                <img
                  src={item.food_image}
                  alt={item.food_name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay label */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6">
                  <p className="text-white text-xl font-bold">{item.food_name}</p>
                  <p className="text-orange-300 font-semibold">₹{item.price}</p>
                </div>
              </div>
            ))}

            {/* Floating badges */}
            <div className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 z-20">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-sm font-bold text-gray-800">4.9 Rating</p>
                <p className="text-xs text-gray-400">10K+ reviews</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 z-20">
              <MdDeliveryDining className="text-3xl text-orange-500" />
              <div>
                <p className="text-sm font-bold text-gray-800">Fast Delivery</p>
                <p className="text-xs text-gray-400">In 28 minutes</p>
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-[-40px] flex gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === activeImg ? 'bg-orange-500 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
