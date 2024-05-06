import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";

import "primeicons/primeicons.css";
import "../node_modules/primeflex/primeflex.css";

import { RouterProvider } from "react-router-dom";
import Router from "@/routes/Route";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={Router} />
  </React.StrictMode>
);
