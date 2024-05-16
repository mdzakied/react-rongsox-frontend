import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import TransactionService from "@services/TransactionService";
import Notification from "@shared/components/Notification/Notification";
import NumberFormatter from "@shared/utils/NumberFormatter";

import SelectCustomer from "./SelectCustomer";
import SelectStuff from "./SelectStuff";

// create schema add for validator with zod
const schemaAdd = z.object({
  amount: z.optional(z.string()),
});

export default function TransactionForm() {
  // use service or shared component with useMemo -> prevent re-render
  const transactionService = useMemo(() => TransactionService(), []);
  const notification = useMemo(() => Notification(), []);
  const numberFormatter = useMemo(() => NumberFormatter(), []);

  // use state for data
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [transDetails, setTransDetails] = useState([]);

  // count total amount
  const totalAmount = transDetails.reduce((acc, item) => {
    return acc + item.amount;
  }, 0);

  // use navigate hook -> redirect
  const navigate = useNavigate();

  // access the client
  const queryClient = useQueryClient();

  // current transaction
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // use form hook with schema from zod resolver
  const { register, handleSubmit } = useForm({
    mode: "onChange",
    resolver: zodResolver(schemaAdd),
  });

  // handle selected customer
  const handleSelectedCustomer = (data) => {
    setSelectedCustomer(data);
  };

  // handle add transaction details
  const handleAddTransDetails = (data) => {
    setTransDetails([...transDetails, data]);
  };

  // handle remove transaction details
  const handleRemoveTransDetails = (stuffId) => {
    setTransDetails(transDetails.filter((item) => item.stuffId !== stuffId));
  };

  // register transaction -> useMutation react query
  const { mutate: serviceTransaction, isPending } = useMutation({
    mutationFn: async () => {
      // generate payload
      const generatePayload = {
        adminId: currentUser.adminId,
        customerId: selectedCustomer.id,
        transactionDetails: transDetails.map((item) => ({
          stuffId: item.stuffId,
          weight: item.weight,
          amount: item.amount,
        })),
        amount: totalAmount,
      };

      // add transaction
      return await transactionService.addTransactionDeposit(generatePayload);
    },
    onSuccess: () => {
      // notification
      notification.showSuccess(
        "Add transaction success, transaction created !"
      );

      // update cache tables
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // redirect
      navigate("/dashboard/transaction");
    },
    onError: () => {
      // notification
      notification.showError("Add transaction failed, please try again !");
    },
  });

  // handle submit
  const onSubmit = () => {
    // service transaction -> useMutation react query
    serviceTransaction();
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
              <h2 className="font-semibold my-0">Add transaction.</h2>
              <p className="text-sm text-gray-400">
                Enter data transaction deposit to create new transaction.
              </p>
            </div>

            {/* Form Select */}
            <div className="mt-5">
              <SelectCustomer
                selectedCustomer={selectedCustomer}
                handleSelectedCustomer={handleSelectedCustomer}
              />

              {/* Card Stuff List */}
              <div className="px-4 pt-4 pb-2 mt-3 border-round shadow-3">
                <div className="flex flex-row text-sm font-semibold">
                  {/* Title */}
                  <div className="flex flex-row">
                    <i className="pi pi-tags mr-2 flex align-items-center"></i>
                    Stuff List
                  </div>
                  {/* Button */}
                  <div className="flex flex-row ml-auto">
                    <SelectStuff
                      handleAddTransDetails={handleAddTransDetails}
                    />
                  </div>
                </div>

                <Divider className="mt-3 mb-4" />

                {/* Stuff List */}
                {transDetails?.map((item, index) => (
                  <div key={index}>
                    {/* Stuff Name */}
                    <div className="grid flex flex-row card mb-3 shadow-3 mb-4">
                      <div className="col-3 sm:col-3 flex flex-column">
                        <span className="text-xs font-semibold">Name</span>
                        <span className="text-xs">{item.stuffName}</span>
                      </div>
                      <div className="col-3 sm:col-3 flex flex-column">
                        <span className="text-xs font-semibold">Weight</span>
                        <span className="text-xs">{item.weight} kg</span>
                      </div>
                      <div className="col-3 sm:col-3 flex flex-column">
                        <span className="text-xs font-semibold">Amount</span>
                        <span className="text-xs">
                          {numberFormatter.formatRupiah(item.amount)}
                        </span>
                      </div>
                      <div className="col-3 sm:col-3 flex flex-column flex  sm:text-right">
                        <i
                          className="pi pi-times my-auto ml-auto txt-danger cursor-pointer"
                          onClick={() => handleRemoveTransDetails(item.stuffId)}
                        ></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="p-inputgroup flex-1 mt-3 hidden">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-transaction"></i>
                </span>
                <InputText
                  {...register("amount")}
                  id="amount"
                  placeholder="Amount"
                  variant="filled"
                  className="p-inputtext-sm w-full lg:w-10"
                  aria-describedby="amount-help"
                  value={totalAmount}
                  disabled
                />
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Card Total Amount */}
                <div className="p-2 mt-3 border-round shadow-3 w-full lg:w-14rem">
                  <span className="text-xs font-semibold">
                    Total Amount : {numberFormatter.formatRupiah(totalAmount)}
                  </span>
                </div>

                {/* Modal Button */}
                <div className="flex flex-row justify-content-end gap-2">
                  {/* Cancel Button */}
                  <Link to="/dashboard/transaction">
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
                    icon="pi pi-plus-circle"
                    label="Add"
                    className="bgn-success w-auto mt-4 py-2"
                    severity="success"
                    size="small"
                    disabled={
                      !selectedCustomer || transDetails.length == 0 || isPending
                    }
                    loading={isPending}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
