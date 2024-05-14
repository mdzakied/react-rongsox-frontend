import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "@pages/Authentication/Login";

import Layout from "@layouts/Layout";
import Dashboard from "@pages/Dashboard/Dashboard";
import Transaction from "@pages/Transaction/Transaction";
import Inventory from "@pages/Inventory/Inventory";

import Admin from "@pages/User/Admin/Admin";
import AdminForm from "@pages/User/Admin/components/AdminForm";

import Customer from "@pages/User/Customer/Customer";
import CustomerForm from "@pages/User/Customer/components/CustomerForm";

import Profile from "@pages/Profile/Profile";

import ErrorBoundary from "@/shared/components/Error/ErrorBoundary";
import Error404 from "@shared/components/Error/Error404";

import RegisterCustomer from "../pages/Authentication/RegisterCustomer";

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
    path: "/register-customer",
    element: <RegisterCustomer />,
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
            element: <Admin />,
            children: [
              {
                path: "add",
                element: <AdminForm />,
              },
              {
                path: "update/:id",
                element: <AdminForm />,
              },
            ],
          },
          {
            path: "customer",
            element: <Customer />,
            children: [
              {
                path: "add",
                element: <CustomerForm />,
              },
              {
                path: "update/:id",
                element: <CustomerForm />,
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
