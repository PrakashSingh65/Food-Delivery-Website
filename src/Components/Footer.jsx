import React from 'react'
import { MdFastfood, MdDeliveryDining } from 'react-icons/md'
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <MdFastfood className="text-white text-xl" />
              </div>
              <span className="text-white text-xl font-black">FoodRush</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hot, fresh meals delivered to your doorstep in under 30 minutes.
              Taste the difference.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition"><FaInstagram size={20}/></a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition"><FaTwitter size={20}/></a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition"><FaFacebook size={20}/></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {['Home', 'Menu', 'About Us', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:text-orange-400 transition">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {['Breakfast', 'Pizza', 'Burger', 'Main Course', 'Soups', 'Pasta'].map(c => (
                <li key={c}><a href="#" className="hover:text-orange-400 transition">{c}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <p>📍 123 Food Street, Mumbai, India</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ hello@foodrush.com</p>
              <div className="mt-4 flex items-center gap-2 text-green-400 font-semibold">
                <MdDeliveryDining size={20} />
                <span>24/7 Delivery Available</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FoodRush. All rights reserved. Made with ❤️ for food lovers.
        </div>
      </div>
    </footer>
  )
}

export default Footer
