import { useEffect, useMemo } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { Button } from "primereact/button";

import AdminList from "./components/AdminList";
import Notification from "@shared/components/Notification/Notification";

export default function Admin() {
  // use service or shared component with useMemo -> prevent re-render
  const notification = useMemo(() => Notification(), []);

  // use navigate hook -> redirect
  const navigate = useNavigate();

  // use effect -> check authorization only superadmin
  useEffect(() => {
    const checkSA = async () => {
      const currentUser = await JSON.parse(localStorage.getItem("user"));

      if (currentUser.roles[0] !== "ROLE_SUPER_ADMIN") {
        //notification
        notification.showError("You are not authorized to access this page !");
        //redirect
        navigate("/dashboard");
      }
    };
    checkSA();
  }, [navigate, notification]);

  return (
    <>
      <section id="adminPage">
        {/* Outlet Admin Form */}
        <Outlet />

        {/* Header */}
        <div className="flex flex-row justify-content-between align-items-center">
          {/*  Title and Subtitle */}
          <div>
            {/* Title */}
            <div>
              <span className="text-2xl font-medium">Admin</span>
            </div>
            {/* Subtitle */}
            <div>
              <span className="text-xs font-medium text-gray-500">
                List of users registered as admin on Rongsox
              </span>
            </div>
          </div>

          {/* Add Button */}
          <div>
            <div className="pl-4">
              <Link to="/dashboard/user/admin/add">
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
          <AdminList />
        </div>
      </section>
    </>
  );
}
