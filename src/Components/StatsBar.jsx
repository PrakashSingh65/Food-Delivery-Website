import React from 'react'

const stats = [
  { emoji: '🍽️', value: '200+', label: 'Menu Items' },
  { emoji: '🚀', value: '28 min', label: 'Avg. Delivery' },
  { emoji: '⭐', value: '4.9', label: 'App Rating' },
  { emoji: '😊', value: '50K+', label: 'Happy Customers' },
  { emoji: '👨‍🍳', value: '80+', label: 'Expert Chefs' },
]

const StatsBar = () => {
  return (
    <div className="w-full bg-linear-to-r from-orange-500 via-red-500 to-pink-500 py-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-6">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-3 text-white">
            <span className="text-3xl">{s.emoji}</span>
            <div>
              <p className="text-xl font-black leading-none">{s.value}</p>
              <p className="text-xs text-orange-100 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsBar
