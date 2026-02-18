import React from 'react'
import image1 from "../assets/image1.avif"
import { LuLeafyGreen } from "react-icons/lu";
import { GiChickenOven } from "react-icons/gi";

const Card = ({name,image,id,price,type}) => {
    
  return (
    <div className='w-[300px] h-[400px] bg-white p-3 rounded-lg
    flex flex-col gap-3 shadow-lg hover:border-2 border-red-700'>
        <div className='w-[100%] h-[60%] overflow-hidden rounded-lg'>
          <img src={image} alt="Food item" className='w-full h-full object-cover' />
        </div>
        <div className='p-4'>
          <h3 className='text-2xl font-semibold text-gray-800'>{name}</h3>
          <p className='text-sm text-gray-600 mt-1'>Food description goes here</p>
        </div>
        <div className='w-full flex justify-between items-center'>
          <span className='text-lg font-bold text-green-600'>Rs {price}</span>
          <div className='flex justify-center items-center gap-2 text-green-500 text-lg font-semibold'>
            {type==="veg"?<LuLeafyGreen />:<GiChickenOven />}<span>{type}</span></div>
        </div>
        <button className='w-full p-3 rounded-lg bg-red-700 text-white 
        hover:bg-green-400 transition-all'>Add to dish</button>
    </div>
  )
}

export default Card