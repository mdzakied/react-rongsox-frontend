import AuthService from "@services/AuthService";
import Notification from "@shared/components/Notification/Notification";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import { useMemo } from "react";

function ProtectedRoute({ children }) {
  // use service or shared component
  const authService = AuthService();
  const notification = useMemo(() => Notification(), []);

  // use navigate hook -> redirect
  const navigate = useNavigate();

  // current user
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // useEffect -> check token always when service or route change
  useEffect(() => {
    // check token
    const checkToken = async () => {
      const isValidate = await authService.validateToken();

      if (!localStorage.getItem("user") || !isValidate) {
        // notification
        notification.showError("Unauthorized, please login first !");

        // remove user
        localStorage.removeItem("user");

        // redirect
        navigate("/login");
      }
    };

    checkToken();
  }, [authService, currentUser, navigate, notification]);

  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

export default ProtectedRoute;
