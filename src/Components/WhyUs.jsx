import React from 'react'
import { MdDeliveryDining } from 'react-icons/md'
import { FaShieldAlt, FaLeaf } from 'react-icons/fa'
import { HiSparkles } from 'react-icons/hi2'
import { IoTimerOutline } from 'react-icons/io5'

const features = [
  {
    icon: <IoTimerOutline className="text-4xl text-orange-500" />,
    title: '30-Min Delivery',
    desc: 'We guarantee your order arrives hot & fresh in under 30 minutes.',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    icon: <FaLeaf className="text-4xl text-green-500" />,
    title: 'Fresh Ingredients',
    desc: 'Every dish is made with handpicked, locally-sourced fresh produce.',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  {
    icon: <FaShieldAlt className="text-4xl text-blue-500" />,
    title: 'Safe & Hygienic',
    desc: 'Strict hygiene standards and tamper-proof packaging every time.',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    icon: <HiSparkles className="text-4xl text-purple-500" />,
    title: 'Top Rated Chefs',
    desc: 'Our dishes are crafted by award-winning chefs with years of experience.',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
]

const WhyUs = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Heading */}
        <div className="text-center mb-14">
          <span className="text-sm font-semibold uppercase tracking-widest text-orange-500">Why Choose Us</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">
            We Put Quality First 🏆
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-base">
            We're more than just a food delivery app — we're your kitchen away from home.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group ${f.bg} border ${f.border} rounded-3xl p-8 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default`}
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs
