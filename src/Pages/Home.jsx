import React from 'react'

import Categories from '../Category'

const Home = () => {
  return (
    <div className='bg-slate-200 w-full h-screen'>
      
      <div className='flex flex-warp justify-center items-center gap-5 w-[100%]'>
        {Categories.map((item)=>{
          return <div className='w-[140px] h-[150px] bg-white flex
          flex-col item-start gap-5 p-5 justify-start text-[20px]
          font-semibold text-gray-600 rounded-lg shadow-xl hover:bg-green-300'>
            {item.icon}
            {item.name}
            
          </div>
        })}
      </div>
    </div>
  )
}

export default Home