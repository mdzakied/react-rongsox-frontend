import { Button } from "primereact/button";
import { Link, Outlet } from "react-router-dom";

import HeroRegister from "@/assets/images/register-customer.png";
import HeroTransaction from "@assets/images/transaction.png";

export default function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <section id="dashboardPage">
        {/* Outlet Transaction Form */}
        <Outlet />

        {/* Header */}
        <div className="flex flex-row justify-content-between align-items-center">
          {/*  Title and Subtitle */}
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Dashboard</span>
            </div>
            {/* Subtitle */}
            <div>
              <span className="text-xs font-medium text-gray-500">
                Welcome back {currentUser.username} to Rongsox
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-row">
          <div className="flex flex-row justify-content-center">
            <div className="grid w-full align-items-center ">
              {/* Register Customer */}
              <div className="col-12 md:col-6 text-center px-3">
                {/* Image */}
                <img src={HeroRegister} alt="HeroRegister" className="w-8" />
                {/* Title */}
                <div className="ml-1">
                  <h3 className="font-semibold my-0">
                    Sign Up to register customer account.
                  </h3>
                  <p className="text-sm text-gray-400">
                    Enter customer username, password and data to register
                    customer.
                  </p>
                </div>
                {/* Button */}
                <div className="mt-4">
                  <Link to="/dashboard/user/customer/add">
                    <Button
                      label="Add Customer"
                      className="bgn-success btn-"
                      severity="success"
                      size="small"
                      style={{ fontSize: "0.7rem" }}
                    />
                  </Link>
                </div>
              </div>

              {/* Add Transaction */}
              <div className="col-12 md:col-6 text-center px-3">
                {/* Image */}
                <img src={HeroTransaction} alt="HeroRegister" className="w-8" />
                {/* Title */}
                <div className="ml-1">
                  <h3 className="font-semibold my-0">
                    Create a new transaction.
                  </h3>
                  <p className="text-sm text-gray-400">
                    Enter request data transaction to create a new transaction from admin.
                  </p>
                </div>
                {/* Button */}
                <div className="mt-4">
                  <Link to="/dashboard/transaction/add">
                    <Button
                      label="Add Transaction"
                      className="bgn-success btn-"
                      severity="success"
                      size="small"
                      style={{ fontSize: "0.7rem" }}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
