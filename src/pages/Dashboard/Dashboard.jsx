import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { useState } from "react";

export default function Dashboard() {
  const [visible, setVisible] = useState(false);

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        // onClick={() => setVisible(false)}
        className="p-button-text txt-primary"
        severity="success"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        // onClick={() => setVisible(false)}
        className="btn-primary"
        severity="success"
        autoFocus
      />
    </div>
  );

  return (
    <>
      <div>Dashboard</div>

      <Button label="Submit" />

      <Button
        label="Show"
        icon="pi pi-external-link"
        onClick={() => setVisible(true)}
        className="btn-primary"
        severity="success"
      />
      <Dialog
        header="Header"
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        footer={footerContent}
        draggable
      >
        <p className="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Dialog>
    </>
  );
}
