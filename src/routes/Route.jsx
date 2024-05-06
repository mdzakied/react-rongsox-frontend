import { createBrowserRouter, Navigate } from "react-router-dom";

import Layout from "@layouts/Layout";
import Dashboard from "@pages/Dashboard/Dashboard";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace={true} />,
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
