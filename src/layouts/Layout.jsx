import { Outlet } from "react-router-dom";

import Navbar from "@shared/components/Navigation/Navbar/Navbar";
import SidebarNav from "../shared/components/Navigation/Sidebar/SidebarNav";
import { useState } from "react";

export default function Layout() {
  const [visibleSbar, setVisibleSbar] = useState(false);

  const handleCloseSbar = () => {
    setVisibleSbar(false);
  };

  const handleOpenSbar = () => {
    setVisibleSbar(true);
  };

  return (
    <>
      <section id="layout">
        <div id="content">
          <div className="flex flex-row">
            {/* Sidebar */}
            <div>
              <SidebarNav
                visibleSbar={visibleSbar}
                handleCloseSbar={handleCloseSbar}
              />
            </div>
            <div className="w-screen">
              {/* Navbar */}
              <nav className="shadow-2 mb-4">
                <Navbar handleOpenSbar={handleOpenSbar} />
              </nav>

              {/* Page */}
              <div className="px-4">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
