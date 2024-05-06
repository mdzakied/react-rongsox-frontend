import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "@layouts/Layout";
import Dashboard from "@pages/Dashboard/Dashboard";

import Login from "@pages/Authentication/Login";
import Register from "@pages/Authentication/Regsiter";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace={true} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "dashboard",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);

export default Router;
