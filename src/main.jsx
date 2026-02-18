import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/Routing.jsx";
import UserContext from "./Context/UserContext.jsx";
import React from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContext>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </UserContext>
  </StrictMode>
);
