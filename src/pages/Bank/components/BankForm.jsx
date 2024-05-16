import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import BankService from "@services/BankService";
import Notification from "@shared/components/Notification/Notification";

// create schema update for validator with zod
const schemaUpdate = z.object({
  id: z.string(),
  bankName: z
    .string()
    .min(3, { message: "Bank Name must be at least 3 characters" }),
  bankCode: z
    .string()
    .min(3, { message: "Bank Code must be at least 3 characters" }),
});

// create schema add for validator with zod
const schemaAdd = z.object({
  bankName: z
    .string()
    .min(3, { message: "Bank Name must be at least 3 characters" }),
  bankCode: z
    .string()
    .min(3, { message: "Bank Code must be at least 3 characters" }),
});

export default function BankForm() {
  // use service or shared component with useMemo -> prevent re-render
  const bankService = useMemo(() => BankService(), []);
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

  // register bank -> useMutation react query
  const { mutate: serviceBank, isPending } = useMutation({
    mutationFn: async (payload) => {
      if (payload.id) {
        // update bank
        return await bankService.updateBank(payload);
      } else {
        // add bank
        return await bankService.addBank(payload);
      }
    },
    onSuccess: () => {
      // notification
      notification.showSuccess(
        id ? "Update bank success !" : "Add bank success, bank created !"
      );

      // update cache tables
      queryClient.invalidateQueries({ queryKey: ["banks"] });

      // redirect
      navigate("/dashboard/bank");
    },
    onError: (error) => {
      // data already exists
      if (error.response.data.message === "Bank Name already exists") {
        // notification
        notification.showError(
          "Bankname already exists, please choose another !"
        );
      } else if (error.response.data.message === "Email already exists") {
        // notification
        notification.showError("Email already exists, please choose another !");
      } else if (
        error.response.data.message === "Phone number already exists"
      ) {
        // notification
        notification.showError(
          "Phone number already exists, please choose another !"
        );
      } else {
        // notification
        notification.showError(
          id
            ? "Update bank failed, please try again !"
            : "Register bank failed, please try again !"
        );
      }
    },
  });

  // get bank by id
  useEffect(() => {
    // update form
    if (id) {
      const getBankById = async () => {
        try {
          // set data to form
          const response = await bankService.getBankById(id);
          const currentBank = response.data;
          setValue("id", currentBank.id);
          setValue("bankName", currentBank.bankName);
          setValue("bankCode", currentBank.bankCode);
        } catch (error) {
          console.log(error);
        }
      };
      getBankById();
    }
  }, [id, bankService, setValue]);

  // handle submit
  const onSubmit = (data) => {
    // service bank -> useMutation react query
    serviceBank(data);
  };

  // handle keydown event to stay in modal
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

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
                {id ? "Update" : "Add"} bank.
              </h2>
              <p className="text-sm text-gray-400">
                {id
                  ? "Enter data bank to update"
                  : "Enter data bank to create an bank."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-5">
                {/* Bank Name */}
                <div className="p-inputgroup flex-1 mb-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-building-columns"></i>
                  </span>
                  <InputText
                    {...register("bankName")}
                    id="bankName"
                    placeholder="Bank Name"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="bankName-help"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Error Bank Name */}
                {errors.bankName && (
                  <small id="bankName-help" className="text-xs p-error">
                    {errors.bankName.message}
                  </small>
                )}

                {/* Bank Code */}
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-credit-card"></i>
                  </span>
                  <InputText
                    {...register("bankCode")}
                    id="bankCode"
                    placeholder="Bank Code"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="bankCode-help"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Error Bank Code*/}
                {errors.bankCode && (
                  <small id="bankCode-help" className="text-xs p-error">
                    {errors.bankCode.message}
                  </small>
                )}

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
                    disabled={!isValid || isPending}
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
