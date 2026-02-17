import React from 'react'
import image1 from "../assets/image1.avif"

const Card = () => {
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
        <div className='w-full h-[200px] overflow-hidden'>
          <img src={image1} alt="Food item" className='w-full h-full object-cover' />
        </div>
        <div className='p-4'>
          <h3 className='text-lg font-semibold text-gray-800'>Food Name</h3>
          <p className='text-sm text-gray-600 mt-1'>Food description goes here</p>
        </div>
        <div className='p-4 flex justify-between items-center border-t'>
          <span className='text-lg font-bold text-green-600'>$10.99</span>
          <button className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700'>Add Cart</button>
        </div>
    </div>
  )
}

export default Card