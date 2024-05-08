import toast from "react-hot-toast";

function Notification() {
  const showSuccess = (message) => {
    toast.success(`${message}`, {
      duration: 3000,
      style: {
        border: "1px solid #21aa05",
        padding: "10px",
        color: "#21aa05",
      },
      iconTheme: {
        primary: "#21aa05",
        secondary: "#FFFAEE",
      },
    });
  };

  const showError = (message) => {
    toast.error(`${message}`, {
      duration: 3000,
      style: {
        border: "1px solid #f4024f",
        padding: "10px",
        color: "#f4024f",
      },
      iconTheme: {
        primary: "#f4024f",
        secondary: "#FFFAEE",
      },
    });
  };

  return {
    showSuccess,
    showError,
  };
}

export default Notification;
