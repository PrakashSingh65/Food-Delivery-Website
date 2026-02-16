import React from 'react'
import { MdFastfood } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FaBagShopping } from "react-icons/fa6";

const Nav = () => {
  return (
    <div className='w-full h-[100px] bg-red-200'>
        <div className='w-60px h-60px rounded-full flex items-center justify-center text-3xl text-white'>
            <MdFastfood />
        </div>
        <from action="">
          <IoSearch />
          <input type="text" placeholder='search Items...' />
        </from>
        <div className='w-full h-[100px] bg-red-200'>
          <div className='w-60px h-60px rounded-full flex items-center justify-center text-3xl text-white'>
            <FaBagShopping />
          </div>
        </div>

    </div>
  )
}

export default Nav