import React from 'react'
import { MdFastfood } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FaBagShopping } from "react-icons/fa6";

const Nav = () => {
  return (
    <div className='w-full h-[100px] flex justify-between items-center px-5 md:px-8'>
        <div className='w-[60px] h-[60px] bg-white flex justify-center
         items-center rounded-full shadow-xl'>
            <MdFastfood className='w-[30px] h-[30px] text-green-500' />
        </div>
        <form className='w-[40%] h-[60px] bg-white flex
        items-center px-5 ga-5 rounded-full shadow-md md:w-[70%]'>
          <IoSearch className='text-green-500 w-[30px] h-[30px]' />
          <input type="text" placeholder='search Items...'
          className='w-[100%] outline-none text-[16px] md:text-[20px]' />
        </form>
          <div className='h-[100px]  flex items-center'>
            <div className='w-[60px] h-[60px] bg-white flex justify-center 
            items-center rounded-md shadow-xl relative'>
              <span className='absolute top-0 right-1 text-green-500 font-bold text-[18px]'>0</span>
            <FaBagShopping className='w-[30px] h-[30px] text-green-500' />
          </div>
        </div>

    </div>
  )
}

export default Nav