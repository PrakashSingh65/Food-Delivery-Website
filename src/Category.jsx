import { TiThSmall } from "react-icons/ti";
import { MdFreeBreakfast } from "react-icons/md";
import { TbSoupFilled } from "react-icons/tb";
import { FaPastafarianism } from "react-icons/fa";
import { MdFoodBank } from "react-icons/md";
import { GiFullPizza } from "react-icons/gi";
import { PiHamburgerBold } from "react-icons/pi";
 const Categories=[
    {
        id:1,
        name:"All",
        image:<TiThSmall className='w-[60px] h-[60px] text-green-600'/>
    },
    {
        id:2,
        name:"Breakfast",
        image:<MdFreeBreakfast className='w-[60px] h-[60px] text-green-600' />
    },
    {
        id:3,
        name:"soup",
        image:<TbSoupFilled className='w-[60px] h-[60px] text-green-600' />
    },
    {
        id:4,
        name:"pasta",
        image:<FaPastafarianism className='w-[60px] h-[60px] text-green-600'/>
    },
    {
        id:5,
        name:"main_course",
        image:<MdFoodBank className='w-[60px] h-[60px] text-green-600'/>
    },
    {
        id:6,
        name:"pizza",
        image:<GiFullPizza className='w-[60px] h-[60px] text-green-600' />
    },
    {
        id:7,
        name:"burger",
        image:<PiHamburgerBold className='w-[60px] h-[60px] text-green-600'/>
    },
]

export default Categories