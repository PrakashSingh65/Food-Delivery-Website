import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Components/Nav'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <div>
      <Nav />
      <div className="pt-20">
        <Outlet />
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}


