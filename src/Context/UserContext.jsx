 import React from 'react'
 import { createContext } from 'react'
 export const dataContext=createContext()
 
 const UserContext = ({ children }) => {
  let[input,setInput]=useState("") 
  let data={
    input,
    setInput
  }

   return (
     <div>
      <dataContext.Provider value={data}>
        {children}
      </dataContext.Provider>
         
     </div>
   )
 }
 
 export default UserContext