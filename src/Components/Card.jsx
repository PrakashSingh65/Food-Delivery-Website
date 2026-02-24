import React from 'react'
import { LuLeafyGreen } from 'react-icons/lu'
import { GiChickenOven } from 'react-icons/gi'
import { FiShoppingCart } from 'react-icons/fi'

const Card = ({ name, image, id, price, type }) => {
  return (
    <div className="group w-[280px] bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 flex flex-col border border-gray-100">

      {/* Image */}
      <div className="relative w-full h-[180px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Veg / Non-veg badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow ${
            type === 'veg'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {type === 'veg' ? (
            <><LuLeafyGreen /> Veg</>
          ) : (
            <><GiChickenOven /> Non-Veg</>
          )}
        </span>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">{name}</h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-black text-orange-500">₹{price}</span>
          <button className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md">
            <FiShoppingCart />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card