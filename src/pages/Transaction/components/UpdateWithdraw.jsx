import { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import PropTypes from "prop-types";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

// create schema update for validator with zod
const schemaUpdate = z.object({
  image: z.any().refine((files) => {
    if (files?.length === 0) return true;
    return ["image/png", "image/jpg", "image/jpeg"].includes(files?.[0].type);
  }, "format gambar tidak sesuai"),
});

export default function UpdateWithdraw({
  transactionId,
  handleUpdateStatusWithdraw,
}) {
  // use state for visible modal and data
  const [visibleModal, setVisibleModal] = useState(false);

  // use form hook with schema from zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schemaUpdate),
  });

  const onSubmit = (data) => {
    // update status transaction withdraw
    handleUpdateStatusWithdraw(transactionId, data.image);

    // reset
    setVisibleModal(false);
  };

  return (
    <div>
      {/* Button Edit */}
      <Button
        onClick={() => setVisibleModal(true)}
        icon="pi pi-check-square"
        text
        raised
        severity="success"
        size="small"
        tooltip="Validate"
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
                <h2 className="font-semibold my-0">
                  Update Status Transaction.
                </h2>
                <p className="text-sm text-gray-400">
                  Upload receipt to update status transaction.
                </p>
              </div>

              <div className="mt-5">
                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Image Field */}
                  <div className="mt-4">
                    <div className="form-field ml-1">
                      <label className="form-label mb-1">Image: </label>
                      <input
                        {...register("image")}
                        size="20"
                        type="file"
                        className={`input bg-grey max-w-full py-1.5 text-xs ${
                          errors.image && "input-error"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    {errors.image && (
                      <label className="form-label">
                        <span className="form-label-alt txt-danger text-xs">
                          {errors.image.message}
                        </span>
                      </label>
                    )}
                  </div>
                </form>
                {/* Modal Button */}
                <div className="flex flex-row justify-content-end gap-2">
                  {/* Close Button */}
                  <Button
                    onClick={() => setVisibleModal(false)}
                    icon="pi pi-times-circle"
                    label="Close"
                    className="w-auto mt-4 py-2"
                    severity="success"
                    size="small"
                    outlined
                  />

                  {/* Update Button */}
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    type="submit"
                    icon={"pi pi-plus-circle"}
                    label={"Save"}
                    className="bgn-success w-auto mt-4 py-2"
                    severity="success"
                    size="small"
                    disabled={!isValid}
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

UpdateWithdraw.propTypes = {
  transactionId: PropTypes.string,
  handleUpdateStatusWithdraw: PropTypes.func,
};