import { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar } from "primereact/avatar";
import { TieredMenu } from "primereact/tieredmenu";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

import PropTypes from 'prop-types';

import Notification from "@shared/components/Notification/Notification";
import ImgProfile from "@assets/images/profile.png";

export default function Navbar({ handleOpenSbar }) {
  // use ref for profile
  const profile = useRef(null);

  // current user
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // items for profile
  const items = [
    {
      label: currentUser?.username,
      icon: "pi pi-user",
    },
    {
      label: currentUser?.roles[0],
      icon: "pi pi-shield",
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        confirmLogout();
      },
    },
  ];

  // use service or shared component with useMemo -> prevent re-render
  const notification = useMemo(() => Notification(), []);

  // use navigate hook -> redirect
  const navigate = useNavigate();

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
      <div
        id="navbar"
        className="flex flex-row justify-content-between lg:justify-content-end py-2"
      >
        {/* Toggle Sidebar  */}
        <div className="flex lg:hidden">
          <Button
            onClick={() => handleOpenSbar()}
            icon="pi pi-bars"
            className="txt-success bg-white border-0 py-2 ml-3"
            severity="secondary"
            size="large"
          />
        </div>
        
        {/* Profile */}
        <div className="flex justify-content-end">
          <Avatar
            image={ImgProfile}
            className="mr-3 shadow-3"
            size="large"
            shape="circle"
            onClick={(e) => profile.current.toggle(e)}
          />

          {/* Pop Up Profile */}
          <TieredMenu
            model={items}
            popup
            ref={profile}
            breakpoint="767px"
            className="text-sm"
          />
        </div>
      </div>
    </>
  );
}

Navbar.propTypes = {
  handleOpenSbar: PropTypes.func
}