import { Link, Outlet } from "react-router-dom";

import { Button } from "primereact/button";

import BankList from "./components/BankList";

export default function Bank() {
  return (
    <>
      <section id="bankPage">
        {/* Outlet Bank Form */}
        <Outlet />

        {/* Header */}
        <div className="flex flex-row justify-content-between align-items-center">
          {/*  Title and Subtitle */}
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Bank</span>
            </div>
            {/* Subtitle */}
            <div>
              <span className="text-xs font-medium text-gray-500">
                List of registered bank on Rongsox
              </span>
            </div>
          </div>

          {/* Add Button */}
          <div>
            <div className="pl-4">
              <Link to="/dashboard/bank/add">
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
          <BankList />
        </div>
      </section>
    </>
  );
}
