import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Restaurant } from '../models/Restaurant.js';
import { MenuItem } from '../models/MenuItem.js';
import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';
import { USER_ROLES, ORDER_STATUS } from '../config/constants.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_delivery_db';

const seed = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected.');

    // Clear existing collections
    console.log('[Seed] Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      Coupon.deleteMany({}),
      Order.deleteMany({}),
    ]);

    // 1. Create Users for all 4 roles
    console.log('[Seed] Creating demo users for all 4 roles...');
    const customer = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@foodrush.com',
      password: 'password123',
      role: USER_ROLES.CUSTOMER,
      phone: '+91 9876543210',
      address: {
        street: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        postalCode: '560103',
      },
      location: {
        type: 'Point',
        coordinates: [77.6713, 12.9279], // Bellandur coordinates
      },
    });

    const restaurantOwner = await User.create({
      name: 'Chef Marco Rossi',
      email: 'restaurant@foodrush.com',
      password: 'password123',
      role: USER_ROLES.RESTAURANT,
      phone: '+91 9876543211',
      address: {
        street: '100 Feet Road, Indiranagar',
        city: 'Bengaluru',
        postalCode: '560038',
      },
      location: {
        type: 'Point',
        coordinates: [77.6412, 12.9784], // Indiranagar
      },
    });

    const deliveryPartner = await User.create({
      name: 'Vikram Singh',
      email: 'delivery@foodrush.com',
      password: 'password123',
      role: USER_ROLES.DELIVERY_PARTNER,
      phone: '+91 9876543212',
      vehicleType: 'bike',
      isOnline: true,
      location: {
        type: 'Point',
        coordinates: [77.6521, 12.9554], // In transit
      },
    });

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@foodrush.com',
      password: 'password123',
      role: USER_ROLES.ADMIN,
      phone: '+91 9876543213',
    });

    console.log('✓ Users created:');
    console.log(`  - Customer: customer@foodrush.com / password123`);
    console.log(`  - Restaurant Owner: restaurant@foodrush.com / password123`);
    console.log(`  - Delivery Partner: delivery@foodrush.com / password123`);
    console.log(`  - Admin: admin@foodrush.com / password123`);

    // 2. Create Restaurants
    console.log('[Seed] Creating restaurants...');
    const restaurant1 = await Restaurant.create({
      name: 'Burger Bistro & Shakes',
      description: 'Gourmet handcrafted burgers, crispy golden fries, and rich creamy thickshakes.',
      cuisineTypes: ['Burgers', 'American', 'Fast Food'],
      rating: 4.6,
      totalRatings: 340,
      priceForTwo: 450,
      deliveryTimeMin: 25,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80',
      address: {
        street: '12th Main Rd, HAL 2nd Stage, Indiranagar',
        city: 'Bengaluru',
        postalCode: '560038',
      },
      location: {
        type: 'Point',
        coordinates: [77.6412, 12.9784],
      },
      isAvailable: true,
      ownerId: restaurantOwner._id,
    });

    const restaurant2 = await Restaurant.create({
      name: 'Spice Route Biryani House',
      description: 'Authentic Dum Biryanis cooked on slow charcoal flame with aromatic Nizami spices.',
      cuisineTypes: ['Biryani', 'North Indian', 'Mughlai'],
      rating: 4.8,
      totalRatings: 520,
      priceForTwo: 600,
      deliveryTimeMin: 35,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&auto=format&fit=crop&q=80',
      address: {
        street: '5th Block, Koramangala',
        city: 'Bengaluru',
        postalCode: '560095',
      },
      location: {
        type: 'Point',
        coordinates: [77.6208, 12.9352],
      },
      isAvailable: true,
      ownerId: restaurantOwner._id,
    });

    const restaurant3 = await Restaurant.create({
      name: 'Bella Italia Woodfire Pizzeria',
      description: 'Hand-stretched sourdough Neapolitan pizzas baked in a 900-degree wood-fired oven.',
      cuisineTypes: ['Italian', 'Pizza', 'Pasta'],
      rating: 4.7,
      totalRatings: 280,
      priceForTwo: 700,
      deliveryTimeMin: 30,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=1200&auto=format&fit=crop&q=80',
      address: {
        street: 'Church Street, Shanthala Nagar',
        city: 'Bengaluru',
        postalCode: '560001',
      },
      location: {
        type: 'Point',
        coordinates: [77.6033, 12.9754],
      },
      isAvailable: true,
      ownerId: restaurantOwner._id,
    });

    // 3. Create Menu Items
    console.log('[Seed] Creating category-wise menu items...');
    const menuItems = await MenuItem.create([
      // Burger Bistro Menu
      {
        restaurantId: restaurant1._id,
        name: 'Classic Smash Cheeseburger',
        description: 'Double smashed crispy beef/chicken patty, melted cheddar, caramelized onions, house special sauce.',
        price: 249,
        category: 'Burgers & Sandwiches',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
        isVeg: false,
        isAvailable: true,
      },
      {
        restaurantId: restaurant1._id,
        name: 'Crispy Paneer Supreme Burger',
        description: 'Spiced battered cottage cheese patty with pickled jalapenos, crisp lettuce, and chipotle mayo.',
        price: 199,
        category: 'Burgers & Sandwiches',
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80',
        isVeg: true,
        isAvailable: true,
      },
      {
        restaurantId: restaurant1._id,
        name: 'Loaded Truffle Parmesan Fries',
        description: 'Hand-cut russet fries tossed with aromatic white truffle oil, grated parmesan, and chives.',
        price: 169,
        category: 'Sides & Appetizers',
        imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80',
        isVeg: true,
        isAvailable: true,
      },
      {
        restaurantId: restaurant1._id,
        name: 'Dark Chocolate Fudge Thickshake',
        description: 'Rich Belgian chocolate ice cream blended with brownies and chocolate fudge drizzle.',
        price: 179,
        category: 'Beverages & Shakes',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80',
        isVeg: true,
        isAvailable: true,
      },

      // Spice Route Biryani Menu
      {
        restaurantId: restaurant2._id,
        name: 'Hyderabadi Chicken Dum Biryani',
        description: 'Long grain aged basmati rice layered with marinated tender chicken, saffron, and mint.',
        price: 349,
        category: 'Biryani & Rice',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
        isVeg: false,
        isAvailable: true,
      },
      {
        restaurantId: restaurant2._id,
        name: 'Nawabi Paneer Tikka Biryani',
        description: 'Char-grilled cottage cheese tikka cubes slow cooked in spiced saffron basmati rice.',
        price: 299,
        category: 'Biryani & Rice',
        imageUrl: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=400&auto=format&fit=crop&q=80',
        isVeg: true,
        isAvailable: true,
      },
      {
        restaurantId: restaurant2._id,
        name: 'Murgh Malai Tikka Kebab',
        description: 'Melt-in-mouth chicken chunks marinated in rich cream, cashew paste, and green cardamom.',
        price: 320,
        category: 'Starters & Kebabs',
        imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=400&auto=format&fit=crop&q=80',
        isVeg: false,
        isAvailable: true,
      },
      {
        restaurantId: restaurant2._id,
        name: 'Gulab Jamun with Rabri (2 Pcs)',
        description: 'Warm golden milk dumplings soaked in cardamom sugar syrup, served with chilled malai rabri.',
        price: 139,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1589119908995-c6837fa14d48?w=400&auto=format&fit=crop&q=80',
        isVeg: true,
        isAvailable: true,
      },

      // Bella Italia Pizzeria Menu
      {
        restaurantId: restaurant3._id,
        name: 'Margherita Burrata Pizza (12 inch)',
        description: 'San Marzano tomato sauce, fresh buffalo mozzarella, creamy burrata ball, and organic basil.',
        price: 499,
        category: 'Woodfired Pizzas',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80',
        isVeg: true,
        isAvailable: true,
      },
      {
        restaurantId: restaurant3._id,
        name: 'Smoked Pepperoni & Hot Honey Pizza',
        description: 'Italian pepperoni slices, mozzarella, chili flakes, finished with artisanal spicy wildflower honey.',
        price: 579,
        category: 'Woodfired Pizzas',
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&auto=format&fit=crop&q=80',
        isVeg: false,
        isAvailable: true,
      },
      {
        restaurantId: restaurant3._id,
        name: 'Tiramisu Classico',
        description: 'Traditional Italian recipe with espresso-soaked savoiardi ladyfingers and mascarpone cream.',
        price: 240,
        category: 'Desserts',
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop&q=80',
        isVeg: true,
        isAvailable: true,
      },
    ]);

    console.log(`✓ ${menuItems.length} menu items seeded across categories.`);

    // 4. Create Coupons
    console.log('[Seed] Creating demo coupons...');
    const coupons = await Coupon.create([
      {
        code: 'WELCOME50',
        description: '50% off on your first order up to ₹100',
        discountType: 'percentage',
        discountValue: 50,
        minOrderValue: 199,
        maxDiscount: 100,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      },
      {
        code: 'FLAT100',
        description: 'Flat ₹100 OFF on orders above ₹399',
        discountType: 'flat',
        discountValue: 100,
        minOrderValue: 399,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'FREEDEL',
        description: '₹30 instant delivery discount on orders above ₹149',
        discountType: 'flat',
        discountValue: 30,
        minOrderValue: 149,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ]);
    console.log(`✓ ${coupons.length} coupons created.`);

    // 5. Create a Live Active Demo Order
    console.log('[Seed] Creating active tracking order...');
    const demoOrder = await Order.create({
      orderNumber: 'FD-20261026-8842',
      customerId: customer._id,
      restaurantId: restaurant1._id,
      deliveryPartnerId: deliveryPartner._id,
      items: [
        {
          menuItemId: menuItems[0]._id,
          name: menuItems[0].name,
          price: menuItems[0].price,
          quantity: 2,
          total: menuItems[0].price * 2,
          imageUrl: menuItems[0].imageUrl,
        },
        {
          menuItemId: menuItems[2]._id,
          name: menuItems[2].name,
          price: menuItems[2].price,
          quantity: 1,
          total: menuItems[2].price * 1,
          imageUrl: menuItems[2].imageUrl,
        },
      ],
      priceBreakdown: {
        subtotal: 667,
        deliveryFee: 0, // Above free delivery threshold
        taxes: 33,
        platformFee: 5,
        discount: 100,
        appliedCoupon: 'FLAT100',
        grandTotal: 605,
      },
      status: ORDER_STATUS.OUT_FOR_DELIVERY,
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED',
      deliveryAddress: {
        street: 'Flat 402, Green Glen Layout, Bellandur',
        city: 'Bengaluru',
        postalCode: '560103',
        location: {
          type: 'Point',
          coordinates: [77.6713, 12.9279],
        },
      },
      deliveryPartnerLocation: {
        lat: 12.9554,
        lng: 77.6521,
        lastUpdated: new Date(),
      },
      statusHistory: [
        {
          status: ORDER_STATUS.PENDING,
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          updatedBy: customer._id,
          note: 'Order placed by customer',
        },
        {
          status: ORDER_STATUS.ACCEPTED,
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          updatedBy: restaurantOwner._id,
          note: 'Restaurant confirmed the order',
        },
        {
          status: ORDER_STATUS.PREPARING,
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          updatedBy: restaurantOwner._id,
          note: 'Chef started food preparation',
        },
        {
          status: ORDER_STATUS.OUT_FOR_DELIVERY,
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          updatedBy: deliveryPartner._id,
          note: 'Delivery partner Vikram picked up order and is on the way',
        },
      ],
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000),
    });

    console.log(`✓ Active demo order created: ${demoOrder.orderNumber} (ID: ${demoOrder._id})`);
    console.log('\n[Seed] Database successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error populating database:', error);
    process.exit(1);
  }
};

seed();
