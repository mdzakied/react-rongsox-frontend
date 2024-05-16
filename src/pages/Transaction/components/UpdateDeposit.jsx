import { useState } from "react";

import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import PropTypes from "prop-types";

export default function UpdateDeposit({
  transactionId,
  handleUpdateStatusDeposit,
}) {
  // use state for visible modal and data
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState();

  return (
    <div>
      {/* Button Edit */}
      <Button
        onClick={() => setVisibleModal(true)}
        icon="pi pi-pen-to-square"
        text
        raised
        severity="warning"
        size="small"
        tooltip="Edit"
        tooltipOptions={{
          position: "bottom",
          mouseTrack: true,
          mouseTrackTop: 15,
        }}
      />

      {/* Dialog Form */}
      <div className="card flex justify-content-center">
        <Dialog
          visible={visibleModal}
          style={{ width: "50vw" }}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          closable={false}
        >
          <div>
            <div className="col-12">
              {/* Title */}
              <div className="ml-1">
                <h2 className="font-semibold my-0">Update Status Transaction.</h2>
                <p className="text-sm text-gray-400">
                  Select status to update status transaction.
                </p>
              </div>

              <div className="mt-5">
                {/* Add Stuff */}
                <div className="card flex justify-content-center">
                  <Dropdown
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                    }}
                    options={[
                      { name: "pending", value: "Pending" },
                      { name: "process", value: "OnProcess" },
                      { name: "success", value: "Success" },
                    ]}
                    optionLabel="name"
                    placeholder="Status"
                    className="w-14rem shadow-3"
                  />
                </div>

                {/* Modal Button */}
                <div className="flex flex-row justify-content-end gap-2">
                  {/* Close Button */}
                  <Button
                    onClick={() => {
                      setSelectedStatus(null), setVisibleModal(false);
                    }}
                    icon="pi pi-times-circle"
                    label="Close"
                    className="w-auto mt-4 py-2"
                    severity="success"
                    size="small"
                    outlined
                  />

                  {/* Update Button */}
                  <Button
                    onClick={() => {
                      handleUpdateStatusDeposit(transactionId, selectedStatus),
                        setSelectedStatus(null),
                        setVisibleModal(false);
                    }}
                    type="submit"
                    icon={"pi pi-plus-circle"}
                    label={"Save"}
                    className="bgn-success w-auto mt-4 py-2"
                    severity="success"
                    size="small"
                    disabled={!selectedStatus}
                  />
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

UpdateDeposit.propTypes = {
  transactionId: PropTypes.string,
  handleUpdateStatusDeposit: PropTypes.func,
};
