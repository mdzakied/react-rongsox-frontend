import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Layout from "@layouts/Layout";
import Dashboard from "@pages/Dashboard/Dashboard";

import Login from "@pages/Authentication/Login";
import RegisterAdmin from "@pages/Authentication/RegisterAdmin";
import RegisterCustomer from "@pages/Authentication/RegisterCustomer";

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
    path: "/register-admin",
    element: (
      <ProtectedRoute>
        <RegisterAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register-customer",
    element: (
      <ProtectedRoute>
        <RegisterCustomer />
      </ProtectedRoute>
    ),
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "user",
        children: [
          {
            path: "admin",
            children: [
              {
                path: "update",
              },
            ],
          },
          {
            path: "customer",
            children: [
              {
                path: "update",
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default Router;
