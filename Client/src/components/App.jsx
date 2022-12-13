import React from "react";
import Home from "./Home";
import Navbar from "./Navbar";
import Charts from "./Charts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/charts",
    element: <Charts />,
  },
]);

export default function App() {
  return (
    <div>
      <Navbar />
      <RouterProvider router={router} />
    </div>
  );
}
