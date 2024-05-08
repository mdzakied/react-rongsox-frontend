import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Layout from "@layouts/Layout";
import Dashboard from "@pages/Dashboard/Dashboard";

import Login from "@pages/Authentication/Login";
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
    path: "/register-admin",
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <RegisterAdmin />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: "/register-customer",
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <RegisterCustomer />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: "dashboard",
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      </ErrorBoundary>
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
