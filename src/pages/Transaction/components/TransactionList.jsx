import { useState, useMemo } from "react";
import {} from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import { Skeleton } from "primereact/skeleton";

import TransactionService from "@services/TransactionService";
import Notification from "@shared/components/Notification/Notification";
import NumberFormatter from "@shared/utils/NumberFormatter";
import UpdateDeposit from "./UpdateDeposit";
import UpdateWithdraw from "./UpdateWithdraw";

export default function TransactionList() {
  // use state for modal and detail
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // access the client
  const queryClient = useQueryClient();

  // use state for data tables and search params
  const [searchParams, setSearchParams] = useSearchParams();

  // use service and utils with useMemo -> prevent re-render
  const transactionService = useMemo(() => TransactionService(), []);
  const notification = useMemo(() => Notification(), []);
  const numberFormatter = useMemo(() => NumberFormatter(), []);

  // search and pagination
  const transactionType = searchParams.get("transactionType" || "");
  const status = searchParams.get("status") || "";
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 5;

  const handleNextPage = () => {
    setSearchParams({
      transactionType: transactionType || "",
      status: status || "",
      page: +page + 1,
      size: size,
    });
  };

  const handlePreviousPage = () => {
    setSearchParams({
      transactionType: transactionType || "",
      status: status || "",
      page: +page - 1,
      size: size,
    });
  };

  const navigatePage = (page) => {
    setSearchParams({
      transactionType: transactionType || "",
      status: status || "",
      page: page,
      size: size,
    });
  };

  // update status transaction deposit -> useMutation react query
  const { mutate: updateStatusTransactionDeposit } = useMutation({
    mutationFn: async (id, status) => {
      // update transaction
      return await transactionService.updateStatusTransactionDepositById(
        id,
        status
      );
    },
    onSuccess: () => {
      // notification
      notification.showSuccess("Update transaction deposit status success !");

      // update cache tables
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      // notification
      notification.showError("Update transaction deposit status failed !");
    },
  });

  // handle submit
  const handleUpdateStatusDeposit = (id, status) => {
    // set payload
    const payload = {
      id: id,
      status: status,
    };

    // update status transaction
    updateStatusTransactionDeposit(payload);

    // reset
    // setSelectedStatus(null);
  };

  // update status transaction withdraw -> useMutation react query
  const { mutate: updateStatusTransactionWithdraw } = useMutation({
    mutationFn: async (payload) => {
      // update transaction
      return await transactionService.updateStatusTransactionWithdraw(payload);
    },
    onSuccess: () => {
      // notification
      notification.showSuccess("Update transaction withdraw status success !");

      // update cache tables
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      // notification
      notification.showError("Update transaction withdraw status failed !");
    },
  });

  // handle submit
  const handleUpdateStatusWithdraw = (id, image) => {
    // set form and data edited
    const form = new FormData();

    console.log("====================================");
    console.log(image[0]);
    console.log("====================================");

    let withdrawal = {
      id: id,
      status: "Success",
    };

    form.append("withdrawal", JSON.stringify(withdrawal));

    if (image) {
      form.append("image", image[0]);
    }

    console.log("====================================");
    console.log(form);
    console.log("====================================");

    // update status transaction
    updateStatusTransactionWithdraw(form);

    // reset
    // setSelectedStatus(null);
  };

  // get all transaction -> react query
  const { data, isLoading } = useQuery({
    queryKey: ["transactions", transactionType, status, page, size],
    queryFn: async () => {
      return await transactionService.getAllTransaction({
        transactionType: transactionType,
        status: status,
        page: page,
        size: size,
      });
    },
  });

  // loading get all transaction -> react query
  if (isLoading) {
    return (
      <>
        {/* Skeleton for loading layout */}
        <div className="flex flex-column w-full">
          <div className="flex flex-row justify-content-end mb-2">
            <Skeleton className="w-10rem" height="6vh"></Skeleton>
          </div>
          <div className="flex flex-row justify-content-between gap-3">
            <Skeleton className="w-5rem" height="6vh"></Skeleton>
            <Skeleton className="w-12rem" height="6vh"></Skeleton>
          </div>
          <div className="flex flex-row w-full mt-2">
            <Skeleton width="100%" height="80vh"></Skeleton>
          </div>
        </div>
      </>
    );
  }

  // header sidebar detail
  const headerSidebarDetail = (
    <div className="flex flex-column align-items-center gap-2">
      <span className="text-xl font-medium">Detail Transaction</span>
    </div>
  );

  // action column table
  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="flex flex-row gap-3">
          {/* Detail */}
          <Button
            onClick={() => {
              setVisibleDetail(true), setSelectedTransaction(rowData);
            }}
            icon="pi pi-external-link"
            text
            raised
            size="small"
            tooltip="Detail"
            tooltipOptions={{
              position: "bottom",
              mouseTrack: true,
              mouseTrackTop: 15,
            }}
          />

          {/* Edit Deposit */}
          <div hidden={rowData.transactionType !== "Deposit"}>
            <UpdateDeposit
              handleUpdateStatusDeposit={handleUpdateStatusDeposit}
              transactionId={rowData.id}
            />
          </div>

          {/* Edit Withdraw */}
          <div hidden={rowData.transactionType !== "Withdrawal"}>
            <UpdateWithdraw
              handleUpdateStatusWithdraw={handleUpdateStatusWithdraw}
              transactionId={rowData.id}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Sidebar Detail Deposit */}
      <Sidebar
        header={headerSidebarDetail}
        visible={visibleDetail}
        onHide={() => setVisibleDetail(false)}
        position="right"
      >
        <div className="mt-2">
          {/* Transaction */}
          <div className="p-3 mb-4 shadow-3">
            {/* Title */}
            <div className="flex flex-row text-sm font-semibold">
              <i className="pi pi-sync mr-2 flex align-items-center"></i>
              Transaction
            </div>
            <Divider className="mt-3" />

            {/* Date */}
            <div className="flex flex-row card mb-3">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Date</span>
                <span className="text-xs">
                  {new Date(
                    selectedTransaction?.transactionDate
                  ).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Type */}
            <div className="flex flex-row card mb-3">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Type</span>
                <span className="text-xs">
                  {selectedTransaction?.transactionType}
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="flex flex-row card mb-3">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Amount</span>
                <span className="text-xs">
                  {numberFormatter.formatRupiah(selectedTransaction?.amount)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-row card">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Status</span>
                <span className="text-xs">{selectedTransaction?.status}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="p-3 mb-4 shadow-3">
            {/* Title */}
            <div className="flex flex-row text-sm font-semibold">
              <i className="pi pi-user mr-2 flex align-items-center"></i>
              Customer
            </div>
            <Divider className="mt-3" />

            {/* Name*/}
            <div className="flex flex-row card mb-3">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Name</span>
                <span className="text-xs">
                  {selectedTransaction?.customerName}
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-row card mb-3">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Phone Number</span>
                <span className="text-xs">
                  {selectedTransaction?.customerPhoneNumber}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-row card">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Address</span>
                <span className="text-xs">
                  {selectedTransaction?.customerAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Detail */}
          <div
            className="p-3 shadow-3"
            hidden={selectedTransaction ? selectedTransaction.transactionType !== "Deposit" : ""}
          >
            {/* Title */}
            <div className="flex flex-row text-sm font-semibold">
              <i className="pi pi-clipboard mr-2 flex align-items-center"></i>
              Transaction Detail
            </div>
            <Divider className="mt-3" />

            {/* List Stuff */}
            {selectedTransaction?.transactionDetails ? (
              selectedTransaction.transactionDetails.map((item, index) => {
                return (
                  <div className="flex flex-row card mb-3" key={index}>
                    <div className="flex flex-column">
                      <i
                        className="pi pi-circle-on my-auto mr-3"
                        style={{ fontSize: "0.4rem" }}
                      ></i>
                    </div>
                    <div className="flex flex-column">
                      <span className="text-xs font-semibold">
                        {item.stuffName}
                      </span>
                      <span className="text-xs">
                        {numberFormatter.formatRupiah(item.buyingPrice)} X{" "}
                        {item.weight} Kg
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>

          {/* Detail Bank Account */}
          <div
            className="p-3 mb-4 shadow-3"
            hidden={selectedTransaction ? selectedTransaction.transactionType !== "Withdrawal" : ""}
          >
            {/* Title */}
            <div className="flex flex-row text-sm font-semibold">
              <i className="pi pi-credit-card mr-2 flex align-items-center"></i>
              Bank Account
            </div>
            <Divider className="mt-3" />

            {/* Bank Name */}
            <div className="flex flex-row card mb-3">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Bank Name</span>
                <span className="text-xs">{selectedTransaction?.bankName}</span>
              </div>
            </div>

            {/* Bank Code */}
            <div className="flex flex-row card mb-3">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Bank Code</span>
                <span className="text-xs">{selectedTransaction?.bankCode}</span>
              </div>
            </div>

            {/* Account Number */}
            <div className="flex flex-row card">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Account Number</span>
                <span className="text-xs">
                  {selectedTransaction?.accountNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Bank Account */}
          <div
            className="p-3 mb-4 shadow-3"
            hidden={selectedTransaction ? selectedTransaction.transactionType !== "Withdrawal" : ""}
          >
            {/* Title */}
            <div className="flex flex-row text-sm font-semibold">
              <i className="pi pi-receipt mr-2 flex align-items-center"></i>
              Receipt
            </div>
            <Divider className="mt-3" />

            {/* Bank Name */}
            <div className="flex flex-row card mb-3">
              <div className="flex flex-column">
                <span className="text-xs font-semibold">Bank Name</span>
                <span className="text-xs">{selectedTransaction?.bankName}</span>
              </div>
            </div>

          </div>
        </div>
      </Sidebar>

      {/* Layout */}
      <div className="flex flex-column w-full">
        {/* Filter Status */}
        <div className="card flex flex-row justify-content-end gap-3 mb-3 filter-status">
          <i
            className="pi pi-filter my-auto pt-1"
            style={{ fontSize: "1.2rem" }}
          ></i>
          <Dropdown
            value={status}
            onChange={(e) => {
              setSearchParams({
                transactionType: transactionType || "",
                status:
                  e.target.value.value === ""
                    ? e.target.value.value
                    : e.target.value || "",
                page: 1,
                size: size,
              });
            }}
            options={[
              { name: "all", value: "" },
              { name: "pending", value: "Pending" },
              { name: "on process", value: "On" },
              { name: "success", value: "Success" },
            ]}
            optionLabel="name"
            placeholder="Status"
            className="w-10rem shadow-3"
          />
        </div>

        {/* Filter */}
        <div className="card flex flex-row justify-content-between gap-3">
          {/* Size */}
          <div>
            <Dropdown
              value={size}
              onChange={(e) => {
                setSearchParams({
                  transactionType: transactionType || "",
                  status: status || "",
                  page: page,
                  size: e.target.value.name,
                });
              }}
              options={[{ name: "5" }, { name: "10" }, { name: "50" }]}
              optionLabel="name"
              placeholder={size}
              className="w-5rem shadow-3"
            />
          </div>

          {/* Filter Type */}
          <div className="card flex flex-row justify-content-end gap-3 mb-3 filter-status">
            <i
              className="pi pi-filter my-auto pt-1 hidden sm:block"
              style={{ fontSize: "1.2rem" }}
            ></i>

            <Dropdown
              value={transactionType}
              onChange={(e) => {
                setSearchParams({
                  transactionType:
                    e.target.value.value === ""
                      ? e.target.value.value
                      : e.target.value || "",
                  status: status || "",
                  page: 1,
                  size: size,
                });
              }}
              options={[
                { name: "all", value: "" },
                { name: "deposit", value: "Deposit" },
                { name: "withdraw", value: "Withdrawal" },
              ]}
              optionLabel="name"
              placeholder="Type"
              className="w-12rem shadow-3"
            />
          </div>
        </div>

        {/* Table */}
        <div className="card mt-4 shadow-3 border-round">
          <DataTable
            value={data.data}
            stripedRows
            style={{ maxWidth: "58rem" }}
          >
            <Column
              header="No"
              body={(data, props) => {
                if (page == 1) {
                  return (props.rowIndex += 1);
                } else {
                  return (props.rowIndex += size * (page - 1) + 1);
                }
              }}
            ></Column>
            <Column
              field="transactionDate"
              header="Date"
              body={(data) => {
                return new Date(data.transactionDate).toLocaleDateString(
                  "en-GB",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                );
              }}
              sortable
            ></Column>
            <Column field="adminName" header="Admin" sortable></Column>
            <Column field="customerName" header="Customer" sortable></Column>
            <Column
              field="transactionType"
              header="Type"
              body={(data) => {
                if (data.transactionType === "Deposit") {
                  return "deposit";
                } else if (data.transactionType === "Withdrawal") {
                  return "withdraw";
                }
              }}
              sortable
            ></Column>
            <Column
              field="amount"
              header="Amount"
              body={(data) => {
                if (data.transactionType === "Deposit") {
                  return numberFormatter.formatRupiah(data.amount);
                } else if (data.transactionType === "Withdrawal") {
                  return numberFormatter.formatRupiah(data.amount);
                }
              }}
              sortable
            ></Column>

            <Column
              field="status"
              header="Status"
              body={(data) => {
                if (data.status === "Success") {
                  return <Tag severity="success" value="success"></Tag>;
                } else if (data.status === "OnProcess") {
                  return <Tag severity="info" value="process"></Tag>;
                } else if (data.status === "Pending") {
                  return <Tag severity="warning" value="pending"></Tag>;
                }
              }}
              sortable
            ></Column>
            <Column header="Action" body={actionBodyTemplate}></Column>
          </DataTable>

          {/* Pagination */}
          {data.data.length === 0 ? (
            <></>
          ) : (
            <div className="m-3">
              {/* Pagination Info */}
              <div className="flex justify-start">
                <div className="pagination">
                  <span className="text-sm">
                    Showing {size * (page - 1) + 1} to{" "}
                    {size * (page - 1) + data.data.length} of{" "}
                    {data.paging.totalElement} entries
                  </span>
                </div>
              </div>
              {/* Pagination */}
              <div className="pagination flex justify-content-end mt-3 sm:mt-0 gap-2 w-full">
                {/* Previous */}
                <Button
                  disabled={!data.paging.hasPrevious}
                  onClick={() => handlePreviousPage()}
                  icon="pi pi-angle-left"
                  text
                  raised
                  size="small"
                  severity="secondary"
                />
                {/* Pages */}
                <Button
                  onClick={() => navigatePage(1)}
                  text
                  raised
                  size="small"
                  className={`${page == 1 ? "bgn-gray" : ""}`}
                  severity="secondary"
                  label="1"
                />
                <Button
                  disabled
                  text
                  raised
                  size="small"
                  className={`btn ${page <= 2 ? "hidden" : ""}`}
                  severity="secondary"
                  label="..."
                />
                <Button
                  text
                  raised
                  size="small"
                  className={`bgn-gray ${
                    page == 1 || page == data.paging.totalPages ? "hidden" : ""
                  }`}
                  severity="secondary"
                  label={page}
                />
                <Button
                  disabled
                  text
                  raised
                  size="small"
                  className={`${
                    page == data.paging.totalPages - 1 ||
                    page == data.paging.totalPages
                      ? "hidden"
                      : ""
                  }`}
                  severity="secondary"
                  label="..."
                />
                <Button
                  onClick={() => navigatePage(data.paging.totalPages)}
                  text
                  raised
                  size="small"
                  className={`btn ${
                    page == data.paging.totalPages ? "bgn-gray" : ""
                  } ${data.paging.totalPages == 1 ? "hidden" : ""}`}
                  severity="secondary"
                  label={data.paging.totalPages}
                />
                {/* Next */}
                <Button
                  disabled={!data.paging.hasNext}
                  onClick={() => handleNextPage()}
                  icon="pi pi-angle-right"
                  text
                  raised
                  size="small"
                  className="btn bg-grey"
                  severity="secondary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
