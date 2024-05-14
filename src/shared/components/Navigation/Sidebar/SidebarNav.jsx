import { useRef, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { StyleClass } from "primereact/styleclass";
import { confirmDialog } from "primereact/confirmdialog";

import PropTypes from "prop-types";

import Notification from "@shared/components/Notification/Notification";
import Logo from "@/assets/images/rongsox-logo.png";

export default function SidebarNav({ visibleSbar, handleCloseSbar }) {
  // user ref for menu user
  const btnRef1 = useRef(null);

  // use service or shared component with useMemo -> prevent re-render
  const notification = useMemo(() => Notification(), []);

  // use navigate hook -> redirect
  const navigate = useNavigate();

  // current user
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // accept logout
  const accept = () => {
    // clear local storage
    localStorage.clear();

    // notification
    notification.showSuccess("You have been logged out");

    // redirect to login page
    navigate("/login");
  };

  // confirm logout
  const confirmLogout = () => {
    confirmDialog({
      message: "Are you sure you want to logout ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
    });
  };

  return (
    <>
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`${visibleSbar ? "block" : "hidden"} hidden lg:block`}
      >
        <div className="min-h-screen static surface-ground">
          <div
            id="app-sidebar-2"
            className="surface-section h-screen flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none "
            style={{ width: "280px" }}
          >
            <div className="flex flex-column h-full">
              <div className="flex align-items-center justify-content-between px-4 flex-shrink-0 shadow-2">
                {/* Logo */}
                <span className="inline-flex align-items-center gap-2">
                  <img src={Logo} alt="Logo" className="w-7rem" />
                </span>

                {/* Close Sidebar Button */}
                <span>
                  <Button
                    onClick={() => handleCloseSbar()}
                    type="button"
                    icon="pi pi-times"
                    text
                    outlined
                    className="txt-success h-2rem w-2rem lg:hidden mt-2"
                  ></Button>
                </span>
              </div>

              {/* Menu */}
              <div className="overflow-y-auto mt-2">
                {/* Dashboard */}
                <ul className="list-none p-3 py-1 m-0">
                  <li>
                    <NavLink
                      to={"/dashboard"}
                      className={({ isActive }) =>
                        isActive
                          ? "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer border-round shadow-3 no-underline"
                          : "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer no-underline"
                      }
                      end
                    >
                      <i className="pi pi-objects-column mr-2"></i>
                      <span className="font-medium">Dashboard</span>
                    </NavLink>
                  </li>
                </ul>

                {/* Transaction */}
                <ul className="list-none p-3 py-1 m-0">
                  <li>
                    <NavLink
                      to={"/dashboard/transaction"}
                      className={({ isActive }) =>
                        isActive
                          ? "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer border-round shadow-3 no-underline"
                          : "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer no-underline"
                      }
                    >
                      <i className="pi pi-chart-line mr-2"></i>
                      <span className="font-medium">Transactions</span>
                    </NavLink>
                  </li>
                </ul>

                {/* Inventory */}
                <ul className="list-none p-3 py-1 m-0">
                  <li>
                    <NavLink
                      to={"/dashboard/inventory"}
                      className={({ isActive }) =>
                        isActive
                          ? "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer border-round shadow-3 no-underline"
                          : "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer no-underline"
                      }
                    >
                      <i className="pi pi-warehouse mr-2"></i>
                      <span className="font-medium">Inventory</span>
                    </NavLink>
                  </li>
                </ul>

                {/* Users */}
                <ul className="list-none p-3 py-1 m-0">
                  <li>
                    <StyleClass
                      nodeRef={btnRef1}
                      selector="@next"
                      enterClassName="hidden"
                      enterActiveClassName="slidedown"
                      leaveToClassName="hidden"
                      leaveActiveClassName="slideup"
                    >
                      <div
                        ref={btnRef1}
                        className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer"
                      >
                        <span className="font-medium">
                          <i className={`pi pi-users mr-2`}></i>
                          User
                        </span>
                        <i className="pi pi-chevron-down"></i>
                        <Ripple />
                      </div>
                    </StyleClass>
                    <ul className="list-none p-0 m-0 ml-2 overflow-hidden">
                      {/* User Admin */}
                      <li
                        className="p-1"
                        hidden={currentUser?.roles[0] === "ROLE_ADMIN"}
                      >
                        <NavLink
                          to={"/dashboard/user/admin"}
                          className={({ isActive }) =>
                            isActive
                              ? "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer border-round shadow-3 no-underline"
                              : "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer no-underline"
                          }
                        >
                          <i className="pi pi-users mr-2"></i>
                          <span className="font-medium">Admin</span>
                        </NavLink>
                      </li>

                      {/* User Customer */}
                      <li className="p-1">
                        <NavLink
                          to={"/dashboard/user/customer"}
                          className={({ isActive }) =>
                            isActive
                              ? "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer border-round shadow-3 no-underline"
                              : "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer no-underline"
                          }
                        >
                          <i className="pi pi-users mr-2"></i>
                          <span className="font-medium">Customer</span>
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>

                {/* Profile */}
                <ul className="list-none p-3 py-1 m-0">
                  <li>
                    <NavLink
                      to={"/dashboard/profile"}
                      className={({ isActive }) =>
                        isActive
                          ? "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer border-round shadow-3 no-underline"
                          : "p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer no-underline"
                      }
                    >
                      <i className="pi pi-user mr-2"></i>
                      <span className="font-medium">Profile</span>
                    </NavLink>
                  </li>
                </ul>

                {/* Logout */}
                <ul className="list-none p-3 py-1 m-0">
                  <li>
                    <div
                      onClick={() => confirmLogout()}
                      className="p-ripple p-3 flex align-items-center text-600 hover:surface-100 cursor-pointer"
                    >
                      <i className="pi pi-sign-out mr-2"></i>
                      <span className="font-medium">Logout</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

SidebarNav.propTypes = {
  visibleSbar: PropTypes.bool,
  handleCloseSbar: PropTypes.func,
};
