import React, { useState } from 'react'

import Categories from '../Category'
import Card from '../Components/Card'
import { food_items } from '../Food'

const Home = () => {
  const [cate,setCate]=useState(food_items)

  function filter(category){
    const categoryLower = category.toLowerCase()
    if(categoryLower==="all"){
      setCate(food_items)
    }
    else{
      const newList=food_items.filter((item)=> item.food_category===categoryLower)
      setCate(newList)
    }
  }
  return (
    <div className='bg-slate-200 w-full py-5'>
      
      <div className='flex flex-wrap justify-center items-center gap-5 w-[100%]'>
        {Categories.map((item) => {
          return <div key={item.id} className='w-[140px] h-[150px] bg-white flex
          flex-col items-start gap-5 p-5 justify-start text-[20px]
          font-semibold text-gray-600 rounded-lg shadow-xl hover:bg-green-200 cursor-pointer
          transition-all duration-200' onClick={()=>filter(item.name.toLowerCase())}>
            {item.icon}
            {item.name}
            
          </div>
        })}
      </div>

      <div className='flex flex-wrap justify-center items-center gap-5 py-8 px-5'>
        {cate.map(
          (item) => (
          <Card 
            key={item.id}
            name={item.food_name} 
            image={item.food_image}
            price={item.price} 
            id={item.id} 
            type={item.food_type}
          />
        ))}
      </div>
    </div>
  )
}

export default Home