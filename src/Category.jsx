import { TiThSmall } from "react-icons/ti";
import { MdFreeBreakfast } from "react-icons/md";
import { TbBowlFilled } from "react-icons/tb";
import { FaPastafarianism } from "react-icons/fa";
import { MdFoodBank } from "react-icons/md";
import { GiFullPizza } from "react-icons/gi";
import { PiHamburgerBold } from "react-icons/pi";
import React from 'react'

const Categories = [
    {
        id:1,
        name:"All",
        icon:<TiThSmall className='w-[60px] h-[60px] text-green-600'/>
    },
    {
        id:2,
        name:"Breakfast",
        icon:<MdFreeBreakfast className='w-[60px] h-[60px] text-green-600' />
    },
    {
        id:3,
        name:"soup",
        icon:<TbBowlFilled className='w-[60px] h-[60px] text-green-600' />
    },
    {
        id:4,
        name:"pasta",
        icon:<FaPastafarianism className='w-[60px] h-[60px] text-green-600'/>
    },
    {
        id:5,
        name:"main_course",
        icon:<MdFoodBank className='w-[60px] h-[60px] text-green-600'/>
    },
    {
        id:6,
        name:"pizza",
        icon:<GiFullPizza className='w-[60px] h-[60px] text-green-600' />
    },
    {
        id:7,
        name:"burger",
        icon:<PiHamburgerBold className='w-[60px] h-[60px] text-green-600'/>
    },
];

export default Categories;