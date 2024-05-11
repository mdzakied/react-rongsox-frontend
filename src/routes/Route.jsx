import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "@pages/Authentication/Login";

import Layout from "@layouts/Layout";
import Dashboard from "@pages/Dashboard/Dashboard";
import Transaction from "@pages/Transaction/Transaction";
import Inventory from "@pages/Inventory/Inventory";
import Admin from "@pages/User/Admin/Admin";
import Customer from "@pages/User/Customer/Customer";
import Profile from "@pages/Profile/Profile";

import RegisterAdmin from "@pages/Authentication/RegisterAdmin";
import RegisterCustomer from "@pages/Authentication/RegisterCustomer";

import ErrorBoundary from "@/shared/components/Error/ErrorBoundary";
import Error404 from "@shared/components/Error/Error404";

const Router = createBrowserRouter([
  {
    path: "*",
    element: <Error404 />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace={true} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: (
      <ErrorBoundary>
        {/* <ProtectedRoute>
          <Layout />
        </ProtectedRoute> */}
        <Layout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "transaction",
        element: <Transaction />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "user",
        children: [
          {
            path: "admin",
            children: [
              {
                index: true,
                element: <Admin />,
              },
            ],
          },
          {
            path: "customer",
            children: [
              {
                index: true,
                element: <Customer />,
              },
            ],
          },
        ],
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

export default Router;
