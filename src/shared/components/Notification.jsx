import { useRef } from "react";

import { Toast } from "primereact/toast";

function Notification() {
  // use ref for toast
  const toast = useRef(null);

  const showSuccess = (message) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: `${message}`,
      life: 3000,
    });
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: `${message}`,
      life: 3000,
    });
  };
  

  return {
    ToastComponent:  <Toast ref={toast} />,
    showSuccess,
    showError,
  };
}

export default Notification;
