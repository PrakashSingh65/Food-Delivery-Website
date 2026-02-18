 import React from 'react'
 import { createContext } from 'react'
 export const dataContext=createContext()
 
 const UserContext = ({ children }) => {

   return (
     <div>
         {children}
     </div>
   )
 }
 
 export default UserContext