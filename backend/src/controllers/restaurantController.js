import { Restaurant } from '../models/Restaurant.js';
import { MenuItem } from '../models/MenuItem.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { calculateDistanceKm } from '../utils/priceCalculator.js';

export const getRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, isVeg, maxDeliveryTime, minRating, lat, lng, page = 1, limit = 10 } = req.query;

    const filter = { isAvailable: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisineTypes: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (cuisine) {
      filter.cuisineTypes = { $in: [new RegExp(cuisine, 'i')] };
    }

    if (maxDeliveryTime) {
      filter.deliveryTimeMin = { $lte: Number(maxDeliveryTime) };
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    const skip = (page - 1) * limit;
    let query = Restaurant.find(filter).skip(skip).limit(Number(limit));

    const total = await Restaurant.countDocuments(filter);
    const restaurants = await query.lean();

    // If coordinates are provided, compute dynamic distance for each restaurant
    const restaurantsWithDistance = restaurants.map((rest) => {
      let distanceKm = null;
      if (lat && lng && rest.location && rest.location.coordinates) {
        const [rLng, rLat] = rest.location.coordinates;
        distanceKm = calculateDistanceKm(Number(lat), Number(lng), rLat, rLng);
      }
      return {
        ...rest,
        distanceKm,
      };
    });

    if (lat && lng) {
      restaurantsWithDistance.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return ApiResponse.success(
      res,
      {
        restaurants: restaurantsWithDistance,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
          limit: Number(limit),
        },
      },
      'Restaurants fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findById(id).lean();
    if (!restaurant) {
      return ApiResponse.error(res, 'Restaurant not found', 404);
    }

    // Fetch all menu items for this restaurant
    const menuItems = await MenuItem.find({ restaurantId: id }).lean();

    // Group items category-wise
    const categorizedMenu = menuItems.reduce((acc, item) => {
      const category = item.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    return ApiResponse.success(
      res,
      {
        restaurant,
        menu: categorizedMenu,
        totalMenuItems: menuItems.length,
      },
      'Restaurant and menu details fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const createRestaurant = async (req, res, next) => {
  try {
    const { name, description, cuisineTypes, priceForTwo, deliveryTimeMin, imageUrl, bannerUrl, address, coordinates } =
      req.body;

    const restaurant = await Restaurant.create({
      name,
      description,
      cuisineTypes,
      priceForTwo,
      deliveryTimeMin,
      imageUrl,
      bannerUrl,
      address,
      location: {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude],
      },
      ownerId: req.user._id,
    });

    return ApiResponse.created(res, { restaurant }, 'Restaurant created successfully');
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return ApiResponse.error(res, 'Restaurant not found', 404);
    }

    // Authorization: owner or admin
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to modify this restaurant', 403);
    }

    Object.assign(restaurant, req.body);
    if (req.body.coordinates) {
      restaurant.location = {
        type: 'Point',
        coordinates: [req.body.coordinates.longitude, req.body.coordinates.latitude],
      };
    }

    await restaurant.save();
    return ApiResponse.success(res, { restaurant }, 'Restaurant updated successfully');
  } catch (error) {
    next(error);
  }
};

export const toggleRestaurantAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return ApiResponse.error(res, 'Restaurant not found', 404);
    }

    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to modify this restaurant', 403);
    }

    restaurant.isAvailable = !restaurant.isAvailable;
    await restaurant.save();

    return ApiResponse.success(
      res,
      { isAvailable: restaurant.isAvailable },
      `Restaurant is now ${restaurant.isAvailable ? 'Open for orders' : 'Closed'}`
    );
  } catch (error) {
    next(error);
  }
};

export const addMenuItem = async (req, res, next) => {
  try {
    const { id: restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return ApiResponse.error(res, 'Restaurant not found', 404);
    }

    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to add menu items to this restaurant', 403);
    }

    const menuItem = await MenuItem.create({
      ...req.body,
      restaurantId,
    });

    return ApiResponse.created(res, { menuItem }, 'Menu item added successfully');
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const menuItem = await MenuItem.findById(itemId);

    if (!menuItem) {
      return ApiResponse.error(res, 'Menu item not found', 404);
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to modify this menu item', 403);
    }

    Object.assign(menuItem, req.body);
    await menuItem.save();

    return ApiResponse.success(res, { menuItem }, 'Menu item updated successfully');
  } catch (error) {
    next(error);
  }
};

export const toggleMenuItemAvailability = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const menuItem = await MenuItem.findById(itemId);

    if (!menuItem) {
      return ApiResponse.error(res, 'Menu item not found', 404);
    }

    const restaurant = await Restaurant.findById(menuItem.restaurantId);
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return ApiResponse.error(res, 'Not authorized to modify this menu item', 403);
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    return ApiResponse.success(
      res,
      { isAvailable: menuItem.isAvailable },
      `Item is now marked as ${menuItem.isAvailable ? 'In Stock' : 'Out of Stock'}`
    );
  } catch (error) {
    next(error);
  }
};
