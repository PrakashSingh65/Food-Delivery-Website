import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { food_items } from '../Food'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/cartSlice'
import { toast } from 'react-toastify'
import { FiShoppingCart, FiArrowLeft, FiStar, FiClock, FiShield } from 'react-icons/fi'
import { LuLeafyGreen } from 'react-icons/lu'
import { GiChickenOven } from 'react-icons/gi'
import Card from '../Components/Card'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [similarItems, setSimilarItems] = useState([])

  useEffect(() => {
    const item = food_items.find(f => f.id === parseInt(id))
    if (item) {
      setProduct(item)
      // Filter similar items by category, excluding the current product
      const similar = food_items
        .filter(f => f.food_category === item.food_category && f.id !== item.id)
        .slice(0, 4)
      setSimilarItems(similar)
    }
    // Scroll to top on id change
    window.scrollTo(0, 0)
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        name: product.food_name,
        image: product.food_image,
        price: product.price,
        type: product.food_type
      }))
      toast.success(`${product.food_name} added to cart!`)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Link to="/" className="text-orange-500 font-bold hover:underline">Back to Menu</Link>
        </div>
      </div>
    )
  }

  // Mock reviews
  const reviews = [
    { id: 1, user: "John Doe", rating: 5, comment: "Absolutely delicious! The flavors were perfectly balanced.", date: "2 days ago" },
    { id: 2, user: "Sarah Smith", rating: 4, comment: "Really liked the presentation. Would order again.", date: "1 week ago" },
    { id: 3, user: "Mike Ross", rating: 5, comment: "Best I've had in a long time. Highly recommend!", date: "2 weeks ago" }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 font-semibold mb-8 transition">
        <FiArrowLeft /> Back to Menu
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        {/* Left: Image */}
        <div className="flex-1">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl group">
            <img 
              src={product.food_image} 
              alt={product.food_name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute top-6 left-6">
              <span className={`px-4 py-2 rounded-2xl text-sm font-bold shadow-lg flex items-center gap-2 ${
                product.food_type === 'veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {product.food_type === 'veg' ? <LuLeafyGreen /> : <GiChickenOven />}
                {product.food_type === 'veg' ? '100% Veg' : 'Non-Veg'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8">
            <span className="text-orange-500 font-black tracking-widest uppercase text-sm mb-3 block">
              {product.food_category.replace('_', ' ')}
            </span>
            <h1 className="text-5xl font-black text-gray-900 mb-4">{product.food_name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < 4 ? "currentColor" : "none"} />)}
              </div>
              <span className="text-gray-400 font-medium">(4.8 • 120+ Reviews)</span>
            </div>
            <p className="text-xl text-gray-500 leading-relaxed mb-8">
              Experience the perfect blend of fresh ingredients and authentic spices in every bite of our signature {product.food_name}. Prepared fresh by our expert chefs to ensure maximum flavor and quality.
            </p>
            
            <div className="flex items-center gap-10 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                  <FiClock size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Delivery</p>
                  <p className="font-bold text-gray-800">25-30 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shadow-sm">
                  <FiShield size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Safety</p>
                  <p className="font-bold text-gray-800">Hygiene Assured</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
              <button 
                onClick={handleAddToCart}
                className="flex-1 max-w-xs bg-linear-to-r from-orange-500 to-red-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <FiShoppingCart size={22} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-black text-gray-900 mb-10">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div key={review.id} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold">
                    {review.user[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{review.user}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <FiStar fill="currentColor" /> {review.rating}
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed italic">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Items */}
      {similarItems.length > 0 && (
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-10">Similar Items You Might Like</h2>
          <div className="flex flex-wrap gap-8">
            {similarItems.map(item => (
              <Card 
                key={item.id} 
                id={item.id} 
                name={item.food_name} 
                image={item.food_image} 
                price={item.price} 
                type={item.food_type} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
