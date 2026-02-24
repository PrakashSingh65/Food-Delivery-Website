import React, { createContext, useState } from 'react'

export const dataContext = createContext()

const UserContext = ({ children }) => {
  const [input, setInput] = useState("")

  // const data = {
  //   input,
  //   setInput,
  // }

  return (
    <dataContext.Provider value={{ input, setInput }}>
      {children}
    </dataContext.Provider>
  )
}

export default UserContext