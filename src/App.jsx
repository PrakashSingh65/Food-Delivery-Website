import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Components/Nav'

export default function App() {
  return (
    <div>
      <Nav />
      <div className="pt-20">
        <Outlet />
      </div>
    </div>
  )
}

