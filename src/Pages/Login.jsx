import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdFastfood } from 'react-icons/md'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useLoginMutation } from '../redux/api/authApi'
import { toast } from 'react-toastify'

const DEMO_ACCOUNTS = [
  { role: 'Customer', email: 'customer@foodrush.com', pass: 'password123' },
  { role: 'Restaurant Owner', email: 'restaurant@foodrush.com', pass: 'password123' },
  { role: 'Delivery Partner', email: 'delivery@foodrush.com', pass: 'password123' },
  { role: 'Admin', email: 'admin@foodrush.com', pass: 'password123' },
]

const Login = () => {
  const navigate = useNavigate()
  const [loginUser, { isLoading }] = useLoginMutation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const fillDemo = (email, pass) => {
    setForm({ email, password: pass })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in both email and password.')
      return
    }

    try {
      const res = await loginUser(form).unwrap()
      if (res.success) {
        toast.success(`Welcome back, ${res.data.user.name}! (${res.data.user.role})`)
        navigate('/')
      }
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Login failed. Please check credentials.'
      setError(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel – branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-linear-to-br from-orange-500 via-red-500 to-pink-600 p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute bottom-10 right-[-60px] w-60 h-60 rounded-full bg-white/10" />

        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <MdFastfood className="text-white text-xl" />
          </div>
          <span className="text-2xl font-black">FoodRush</span>
        </div>

        <div className="z-10 space-y-4 max-w-md">
          <h1 className="text-4xl font-black leading-tight">
            Delicious food, delivered fast to your doorstep.
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            Order from the top restaurants in town and track your delivery live with real-time GPS coordinates.
          </p>
        </div>

        <div className="z-10 text-xs text-white/60">
          © {new Date().getFullYear()} FoodRush Platform. All rights reserved.
        </div>
      </div>

      {/* Right panel – login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
              Full-Stack Connected
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">Sign In to FoodRush</h2>
            <p className="text-gray-400 text-sm mt-1">
              Don't have an account?{' '}
              <Link to="/signup" className="text-orange-500 font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>

          {/* Quick Demo Credentials */}
          <div className="bg-orange-50/70 border border-orange-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-orange-800 mb-2">⚡ Quick 1-Click Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => fillDemo(acc.email, acc.pass)}
                  className="text-left text-xs bg-white hover:bg-orange-100/50 border border-orange-200 text-gray-800 px-2.5 py-1.5 rounded-lg transition font-medium"
                >
                  <span className="font-bold text-orange-600 block">{acc.role}</span>
                  {acc.email.split('@')[0]}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-orange-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/25 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Authenticating with Backend...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <Link to="/" className="text-xs text-gray-500 hover:text-orange-500 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
