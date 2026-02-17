import React from 'react'

import Categories from '../Category'

const Home = () => {
  return (
    <div className='bg-slate-200 w-full h-screen'>
      
      <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
        {Categories.map((item) => (
          <div key={item.id} className='flex items-center gap-4 bg-white p-3 rounded-md'>
            {item.icon}
            <span className='font-medium'>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home