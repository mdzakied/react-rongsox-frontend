import React from "react";
import Error500 from "./Error500";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    return this.state.hasError ? <Error500 /> : this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};  

export default ErrorBoundary;
