import { Button } from "primereact/button";
import { Link, Outlet } from "react-router-dom";

import CustomerList from "./components/CustomerList";


export default function Customer() {
  return (
    <>
      <section id="customerPage">
        {/* Outlet Customer Form */}
        <Outlet />

        {/* Header */}
        <div className="flex flex-row justify-content-between align-items-center">
          {/*  Title and Subtitle */}
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Customer</span>
            </div>
            {/* Subtitle */}
            <div>
              <span className="text-xs font-medium text-gray-500">
                List of users registered as customer on Rongsox
              </span>
            </div>
          </div>

          {/* Add Button */}
          <div>
            <div className="pl-4">
              <Link to="/dashboard/user/customer/add">
                <Button
                  label={"Add"}
                  className="bgn-success shadow-3"
                  severity="success"
                  size="small"
                  icon="pi pi-plus-circle"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-row mt-6">
          <CustomerList />
        </div>
      </section>
    </>
  );
}
