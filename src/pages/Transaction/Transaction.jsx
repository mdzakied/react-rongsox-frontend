import { Button } from "primereact/button";
import { Link, Outlet } from "react-router-dom";

import TransactionList from "./components/TransactionList";

export default function Transaction() {
  return (
    <>
      <section id="transactionPage">
        {/* Outlet Transaction Form */}
        <Outlet />

        {/* Header */}
        <div className="flex flex-row justify-content-between align-items-center">
          {/*  Title and Subtitle */}
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Transaction</span>
            </div>
            {/* Subtitle */}
            <div>
              <span className="text-xs font-medium text-gray-500">
                List of transaction on Rongsox
              </span>
            </div>
          </div>

          {/* Add Button */}
          <div>
            <div className="pl-4">
              <Link to="/dashboard/transaction/add">
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
          <TransactionList />
        </div>
      </section>
    </>
  );
}
