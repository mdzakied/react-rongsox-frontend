import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import InventoryService from "@services/InventoryService";
import Notification from "@shared/components/Notification/Notification";

// create schema update for validator with zod
const schemaUpdate = z.object({
  id: z.string(),
  // stuffName: z
  //   .string()
  //   .min(4, { message: "Name must be at least 4 characters" }),
  buyingPrice: z.any(),
  sellingPrice: z.any(),
  // weight: z.string().min(1, { message: "Weight is required" }),
  // image: z
  //   .any()
  //   .optional()
  //   .refine((files) => {
  //     if (files?.length === 0) return true;
  //     return ["image/png", "image/jpg", "image/jpeg"].includes(files?.[0].type);
  //   }, "format gambar tidak sesuai"),
});

// create schema add for validator with zod
const schemaAdd = z.object({
  stuffName: z.string().min(4, { message: "Name must be at least 4 characters" }),
  buyingPrice: z.string().min(1, { message: "Buying price is required" }),
  sellingPrice: z.string().min(1, { message: "Selling price is required" }),
  // weight: z.string().min(1, { message: "Weight is required" }),
  image: z.any().refine((files) => {
    if (files?.length === 0) return true;
    return ["image/png", "image/jpg", "image/jpeg"].includes(files?.[0].type);
  }, "format gambar tidak sesuai"),
});

export default function InventoryForm() {
  // use service or shared component with useMemo -> prevent re-render
  const inventoryService = useMemo(() => InventoryService(), []);
  const notification = useMemo(() => Notification(), []);

  // use search params for id
  const { id } = useParams();

  // use navigate hook -> redirect
  const navigate = useNavigate();

  // access the client
  const queryClient = useQueryClient();

  // use form hook with schema from zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(id ? schemaUpdate : schemaAdd),
  });

  // service inventory -> useMutation react query
  const { mutate: serviceInventory, isPending } = useMutation({
    mutationFn: async (payload) => {
      if (id) {
        // update inventory
        return await inventoryService.updateInventory(payload);
      } else {
        // add inventory
        return await inventoryService.addInventory(payload);
      }
    },
    onSuccess: () => {
      // notification
      notification.showSuccess(
        id
          ? "Update inventory success !"
          : "Register stuff success, stuff created !"
      );

      // update cache tables
      queryClient.invalidateQueries({ queryKey: ["stuffs"] });

      // redirect
      navigate("/dashboard/inventory");
    },
    onError: () => {
      // notification
      notification.showError(
        id
          ? "Update inventory failed, please try again !"
          : "Add inventory failed, please try again !"
      );
    },
  });

  // handle submit
  const onSubmit = (data) => {
    // set form and data edited
    const form = new FormData();

    let stuff = {};

    // conditional create or update
    if (data.id) {
      stuff = {
        id: data.id,
        stuffName: data.stuffName,
        buyingPrice: data.buyingPrice,
        sellingPrice: data.sellingPrice,
        weight: data.weight,
        status: true,
      };
    } else {
      stuff = {
        stuffName: data.stuffName,
        sellingPrice: data.sellingPrice,
        buyingPrice: data.buyingPrice,
      };
    }

    form.append("stuff", JSON.stringify(stuff));

    if (data.image) {
      form.append("image", data.image[0]);
    }

    // service inventory -> useMutation react query
    serviceInventory(form);
  };

  // handle keydown event to stay in modal
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  // get inventory by id
  useEffect(() => {
    // update form
    if (id) {
      const getInventoryById = async () => {
        try {
          // set data to form
          const response = await inventoryService.getInventoryById(id);
          const currentInventory = response.data;
          setValue("id", currentInventory.id);
          setValue("stuffName", currentInventory.stuffName);
          setValue("buyingPrice", currentInventory.buyingPrice);
          setValue("sellingPrice", currentInventory.sellingPrice);
          setValue("weight", currentInventory.weight);
        } catch (error) {
          console.log(error);
        }
      };
      getInventoryById();
    }
  }, [id, inventoryService, setValue]);

  return (
    // Dialog Form
    <div className="card flex justify-content-center">
      <Dialog
        visible={true}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        closable={false}
      >
        <div>
          <div className="col-12">
            {/* Title */}
            <div className="ml-1">
              <h2 className="font-semibold my-0">
                {id ? "Update" : "Add"} inventory.
              </h2>
              <p className="text-sm text-gray-400">
                {id
                  ? "Enter data stuff to update an inventory."
                  : "Enter data stuff to create in inventory."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-5">
                {/* stuffName */}
                <div className="p-inputgroup flex-1 mt-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                  </span>
                  <InputText
                    {...register("stuffName")}
                    id="name"
                    placeholder="Name"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="name-help"
                    onKeyDown={handleKeyDown}
                    disabled={id ? true : false}
                  />
                </div>

                {/* Error Name */}
                {errors.stuffName && (
                  <small id="stuffName-help" className="text-xs p-error">
                    {errors.stuffName.message}
                  </small>
                )}

                {/* Weight */}
                {/* <div className="p-inputgroup flex-1 mt-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-mobile"></i>
                  </span>
                  <InputText
                    {...register("weight")}
                    step="0.1"
                    id="weight"
                    type="number"
                    placeholder="Weight"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="weight-help"
                    min={0.0}
                    onKeyDown={handleKeyDown}
                  />
                </div> */}

                {/* Error Weight */}
                {/* {errors.weight && (
                  <small id="weight-help" className="text-xs p-error">
                    {errors.weight.message}
                  </small>
                )} */}

                {/* Buying Price */}
                <div className="form-label text-xs my-2">Buying Price: </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-tag"></i>
                  </span>
                  <InputText
                    {...register("buyingPrice")}
                    id="buyingPrice"
                    type="number"
                    placeholder="Buying Price"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="buyingPrice-help"
                    min={0}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Error Buying Price */}
                {errors.buyingPrice && (
                  <small id="buyingPrice-help" className="text-xs p-error">
                    {errors.buyingPrice.message}
                  </small>
                )}

                {/* Selling Price */}
                <div className="form-label text-xs my-2">Selling Price: </div>
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-tag"></i>
                  </span>
                  <InputText
                    {...register("sellingPrice")}
                    id="sellingPrice"
                    type="number"
                    placeholder="Selling Price"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="sellingPrice-help"
                    min={0.0}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Error Selling Price */}
                {errors.sellingPrice && (
                  <small id="sellingPrice-help" className="text-xs p-error">
                    {errors.sellingPrice.message}
                  </small>
                )}

                {/* Image Field */}
                <div className="mt-4" hidden={id}>
                  <div className="form-field">
                    <label className="form-label mb-1">Image: </label>
                    <input
                      {...register("image")}
                      size="20"
                      type="file"
                      className={`input bg-grey max-w-full py-1.5 text-xs ${
                        errors.image && "input-error"
                      }`}
                      required={id ? false : true}
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

                {/* Name */}
                {/* <div className="p-inputgroup flex-1 mt-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-inventory"></i>
                  </span>
                  <InputText
                    {...register("name")}
                    id="name"
                    placeholder="Name"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="name-help"
                    onKeyDown={handleKeyDown}
                  />
                </div> */}

                {/* Error Name */}
                {/* {errors.name && (
                  <small id="name-help" className="text-xs p-error">
                    {errors.name.message}
                  </small>
                )} */}

                {/* Modal Button */}
                <div className="flex flex-row justify-content-end gap-2">
                  {/* Cancel Button */}
                  <Link to="/dashboard/inventory">
                    <Button
                      icon="pi pi-times-circle"
                      label="Cancel"
                      className="w-auto mt-4 py-2"
                      severity="success"
                      size="small"
                      outlined
                    />
                  </Link>

                  {/* Add Button */}
                  <Button
                    type="submit"
                    icon={id ? "pi pi-check-circle" : "pi pi-plus-circle"}
                    label={id ? "Save" : "Add"}
                    className="bgn-success w-auto mt-4 py-2"
                    severity="success"
                    size="small"
                    disabled={id ? isPending : isPending || !isValid}
                    loading={isPending}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
