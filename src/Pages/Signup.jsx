import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdFastfood } from 'react-icons/md'
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { HiSparkles } from 'react-icons/hi2'

const Signup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit number'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) newErrors.confirm = 'Passwords do not match'
    return newErrors
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/login')
    }, 1200)
  }

  const Field = ({ icon: Icon, name, type = 'text', placeholder, rightSlot }) => (
    <div>
      <label className="text-sm font-semibold text-gray-700 block mb-1.5 capitalize">
        {name === 'confirm' ? 'Confirm Password' : name === 'phone' ? 'Phone Number' : name}
      </label>
      <div className={`flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}>
        <Icon className="text-gray-400 text-lg shrink-0" />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
        />
        {rightSlot}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1 ml-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen flex">

      {/* Left panel – branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-linear-to-br from-green-500 via-emerald-500 to-teal-600 p-12 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-[-60px] w-72 h-72 rounded-full bg-white/10" />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <MdFastfood className="text-white text-xl" />
          </div>
          <span className="text-2xl font-black">FoodRush</span>
        </div>

        {/* Center copy */}
        <div className="z-10">
          <h2 className="text-5xl font-black leading-tight mb-4">
            Join the<br />foodie family! 🥗
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Create your free account today and enjoy exclusive deals, faster checkout, and order tracking — all in one place.
          </p>
          <div className="flex flex-col gap-3 mt-8">
            {['Free delivery on first 3 orders', 'Exclusive member-only deals', 'Real-time order tracking'].map(p => (
              <div key={p} className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3">
                <HiSparkles className="text-yellow-300 text-lg shrink-0" />
                <span className="text-sm font-medium">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-xs z-10">© {new Date().getFullYear()} FoodRush. All rights reserved.</p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <MdFastfood className="text-white" />
            </div>
            <span className="text-xl font-black text-gray-800">Food<span className="text-orange-500">Rush</span></span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1">Create account 🎉</h1>
          <p className="text-gray-400 text-sm mb-7">Start ordering your favourite food today</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field icon={FiUser} name="name" placeholder="Your full name" />
            <Field icon={FiMail} name="email" type="email" placeholder="you@example.com" />
            <Field icon={FiPhone} name="phone" placeholder="10-digit mobile number" />

            {/* Password with toggle */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Password</label>
              <div className={`flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition ${errors.password ? 'border-red-400' : 'border-gray-200'}`}>
                <FiLock className="text-gray-400 text-lg shrink-0" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="text-gray-400 hover:text-gray-600 transition">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1.5">Confirm Password</label>
              <div className={`flex items-center gap-3 bg-white border-2 rounded-2xl px-4 py-3 focus-within:border-orange-400 transition ${errors.confirm ? 'border-red-400' : 'border-gray-200'}`}>
                <FiLock className="text-gray-400 text-lg shrink-0" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirm"
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)} className="text-gray-400 hover:text-gray-600 transition">
                  {showConfirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirm && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 leading-relaxed">
              By signing up you agree to our{' '}
              <a href="#" className="text-orange-500 hover:underline font-medium">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-orange-500 hover:underline font-medium">Privacy Policy</a>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 bg-white py-3.5 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition font-semibold text-gray-700 text-sm"
            >
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
