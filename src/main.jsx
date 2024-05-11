import ReactDOM from "react-dom/client";
import "./index.scss";

import "primeicons/primeicons.css";
import "../node_modules/primeflex/primeflex.css";

import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

import { RouterProvider } from "react-router-dom";
import Router from "@/routes/Route";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import { ConfirmDialog } from "primereact/confirmdialog";

// Create a client for react-query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    {/* Provide the client to your App */}
    <QueryClientProvider client={queryClient}>
      <PrimeReactProvider>
        {/* Toast for Notification */}
        <Toaster position="top-right" />
        {/* Confirm Dialog Logout */}
        <ConfirmDialog />
        <RouterProvider router={Router} />
      </PrimeReactProvider>
    </QueryClientProvider>
  </>
);
