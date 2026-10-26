import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Cart from "../Pages/Cart";
import ProductDetail from "../Pages/ProductDetail";
import RestaurantDetail from "../Pages/RestaurantDetail";
import Orders from "../Pages/Orders";
import LiveTracking from "../Pages/LiveTracking";
import App from "../App";
import React from "react";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "cart",
                element: <Cart />,
            },
            {
                path: "restaurant/:id",
                element: <RestaurantDetail />,
            },
            {
                path: "product/:id",
                element: <ProductDetail />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "track",
                element: <LiveTracking />,
            },
            {
                path: "track/:id",
                element: <LiveTracking />,
            },
        ]
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
])

export default router
