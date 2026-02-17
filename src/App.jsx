import React from 'react'
import Home from './Pages/Home'
import { Outlet } from 'react-router-dom'
import Nav from './Components/Nav'
export default function App() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  )
}
