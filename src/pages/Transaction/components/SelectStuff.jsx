import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import { useQuery } from "@tanstack/react-query";

import PropTypes from "prop-types";

import InventoryService from "@services/InventoryService";
import Notification from "@shared/components/Notification/Notification";

// create schema add for validator with zod
const schemaAdd = z.object({
  weight: z.string(),
});

export default function SelectStuff({ handleAddTransDetails }) {
  // use service and utils with useMemo -> prevent re-render
  const inventoryService = InventoryService();
  const notification = useMemo(() => Notification(), []);

  // use state for visible modal and data
  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedStuff, setSelectedStuff] = useState();

  // use form hook with schema from zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schemaAdd),
  });

  // get all stuff -> react query
  const { data, isLoading } = useQuery({
    queryKey: ["stuffs"],
    queryFn: async () => {
      return await inventoryService.getAllInventory({
        size: 100,
      });
    },
  });

  // stuffs data
  const stuffs = data?.data;

  // handle submit
  const onSubmit = (data) => {
    // set data
    const stuff = {
      stuffId: selectedStuff?.id,
      stuffName: selectedStuff?.stuffName,
      weight: data.weight,
      amount: data.weight * selectedStuff?.buyingPrice,
    };

    // handle add to card
    handleAddTransDetails(stuff);

    // notification
    notification.showSuccess("Stuff added to transaction !");

    // reset
    setSelectedStuff(null);
    reset();
  };

  // handle keydown event to stay in modal
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div>
      {/* Button Add */}
      <i
        onClick={() => setVisibleModal(true)}
        className="pi pi-plus my-auto ml-auto txt-success cursor-pointer"
      ></i>

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
                <h2 className="font-semibold my-0">Add Stuff.</h2>
                <p className="text-sm text-gray-400">
                  Select stuff and add weight
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-5">
                  {/* Add Stuff */}
                  <div className="card flex justify-content-end">
                    <Dropdown
                      value={selectedStuff}
                      onChange={(e) => setSelectedStuff(e.value)}
                      options={stuffs}
                      optionLabel="stuffName"
                      placeholder="Select a Stuff"
                      filter
                      className="w-full md:w-14rem border-0 border-rounded shadow-3"
                      loading={isLoading}
                      showClear
                    />
                  </div>

                  {/* Weight */}
                  <div className="p-inputgroup flex-1 mt-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-clipboard"></i>
                    </span>
                    <InputText
                      {...register("weight")}
                      id="weight"
                      type="number"
                      placeholder="Weight : 1.0"
                      variant="filled"
                      className="p-inputtext-sm w-full lg:w-10"
                      aria-describedby="weight-help"
                      onKeyDown={handleKeyDown}
                      step="0.1"
                      min={1.0}
                      required
                    />
                  </div>

                  {/* Modal Button */}
                  <div className="flex flex-row justify-content-end gap-2">
                    {/* Close Button */}
                    <Button
                      onClick={() => {
                        reset(), setVisibleModal(false);
                      }}
                      icon="pi pi-times-circle"
                      label="Close"
                      className="w-auto mt-4 py-2"
                      severity="success"
                      size="small"
                      outlined
                    />

                    {/* Add Button */}
                    <Button
                      type="submit"
                      icon={"pi pi-plus-circle"}
                      label={"Add"}
                      className="bgn-success w-auto mt-4 py-2"
                      severity="success"
                      size="small"
                      disabled={!selectedStuff || !isValid}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

SelectStuff.propTypes = {
  handleAddTransDetails: PropTypes.func,
};