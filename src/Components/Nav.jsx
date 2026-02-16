import React from 'react'
import { MdFastfood } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FaBagShopping } from "react-icons/fa6";

const Nav = () => {
  return (
    <div className='w-full h-[100px] flex justify-between items-center px-8'>
        <div className='w-[60px] h-[60px] bg-white flex justify-center
         items-center rounded-md shadow-xl'>
            <MdFastfood className='w-[30px] h-[30px] text-green-500' />
        </div>
        <form className='w-[60%] h-[60px] bg-white flex
        items-center px-5 ga-5'>
          <IoSearch />
          <input type="text" placeholder='search Items...'
          className='w-[100%] outline-none text-[20px]' />
        </form>
          <div className='h-[100px]  flex items-center'>
            <div className='w-[60px] h-[60px] bg-white flex justify-center 
            items-center rounded-md shadow-xl'>
            <FaBagShopping className='w-[30px] h-[30px] text-green-500' />
          </div>
        </div>

    </div>
  )
}

export default Nav