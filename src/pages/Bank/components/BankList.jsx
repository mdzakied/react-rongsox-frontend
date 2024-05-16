import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery} from "@tanstack/react-query";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import { Skeleton } from "primereact/skeleton";

import BankService from "@services/BankService";
// import Notification from "@shared/components/Notification/Notification";

// create schema search for validator with zod
const schema = z.object({
  search: z.optional(z.string()),
});

export default function BankList() {
  // // access the client
  // const queryClient = useQueryClient();

  // use state for data tables and search params
  const [searchParams, setSearchParams] = useSearchParams();

  // use service and utils with useMemo -> prevent re-render
  const bankService = useMemo(() => BankService(), []);
  // const notification = useMemo(() => Notification(), []);

  // use form hook with schema from zod resolver
  const { register, handleSubmit } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(schema),
  });

  // search and pagination
  const search = searchParams.get("name" || "");
  const status = searchParams.get("status") || "";
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 5;

  // handle search and pagination
  const onSubmitSearch = ({ search }) => {
    setSearchParams({
      name: search || "",
      status: status || "",
      page: 1,
      size: size,
    });
  };

  const handleNextPage = (search) => {
    setSearchParams({
      name: search || "",
      status: status || "",
      page: +page + 1,
      size: size,
    });
  };

  const handlePreviousPage = (search) => {
    setSearchParams({
      name: search || "",
      status: status || "",
      page: +page - 1,
      size: size,
    });
  };

  const navigatePage = (search, page) => {
    setSearchParams({
      name: search || "",
      status: status || "",
      page: page,
      size: size,
    });
  };

  // // update status bank -> useMutation react query
  // const { mutate: updateStatusBank } = useMutation({
  //   mutationFn: async (id, status) => {
  //     // update bank
  //     return await bankService.updateStatusBankById(id, status);
  //   },
  //   onSuccess: () => {
  //     // notification
  //     notification.showSuccess("Update bank status success !");

  //     // update cache tables
  //     queryClient.invalidateQueries({ queryKey: ["banks"] });
  //   },
  //   onError: () => {
  //     // notification
  //     notification.showError("Update bank status failed !");
  //   },
  // });

  // get all bank -> react query
  const { data, isLoading } = useQuery({
    queryKey: ["banks", search, status, page, size],
    queryFn: async () => {
      return await bankService.getAllBank({
        name: search,
        status: status,
        page: page,
        size: size,
      });
    },
  });

  // loading get all bank -> react query
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
            <Skeleton className="w-15rem" height="6vh"></Skeleton>
          </div>
          <div className="flex flex-row w-full mt-2">
            <Skeleton width="100%" height="80vh"></Skeleton>
          </div>
        </div>
      </>
    );
  }

  // action column table
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-row gap-3">
        {/* Edit */}
        <Link to={`/dashboard/bank/update/${rowData.id}`}>
          <Button
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
        </Link>

        {/* Activate / Inactive */}
        {/* {rowData.status ? (
          <Button
            onClick={() => {
              confirmStatus(rowData);
            }}
            icon="pi pi-ban"
            text
            raised
            severity="danger"
            size="small"
            tooltip="Inactive"
            tooltipOptions={{
              position: "bottom",
              mouseTrack: true,
              mouseTrackTop: 15,
            }}
          />
        ) : (
          <Button
            onClick={() => {
              confirmStatus(rowData);
            }}
            icon="pi pi-circle"
            text
            raised
            severity="success"
            size="small"
            tooltip="Active"
            tooltipOptions={{
              position: "bottom",
              mouseTrack: true,
              mouseTrackTop: 15,
            }}
          />
        )} */}
      </div>
    );
  };

  // // accept update status
  // const accept = (rowData) => {
  //   const payload = {
  //     id: rowData.id,
  //     status: !rowData.status,
  //   };

  //   // update status bank -> useMutation react query
  //   updateStatusBank(payload);
  // };

  // // confirm update status
  // const confirmStatus = (rowData) => {
  //   confirmDialog({
  //     message: "Are you sure you want to update status ?",
  //     header: "Confirmation",
  //     icon: "pi pi-exclamation-triangle",
  //     defaultFocus: "accept",
  //     accept: () => accept(rowData),
  //   });
  // };

  return (
    <>
      {/* Layout */}
      <div className="flex flex-column w-full">
        {/* Filter Status */}
        <div className="card flex flex-row justify-content-end gap-3 mb-3 filter-status">
          <i
            className="pi pi-filter  my-auto pt-1"
            style={{ fontSize: "1.2rem" }}
          ></i>

          <Dropdown
            value={status}
            onChange={(e) => {
              setSearchParams({
                name: search || "",
                status: e.target.value || "",
                page: 1,
                size: size,
              });
            }}
            options={[
              { name: "all", value: " " },
              { name: "active", value: "true" },
              { name: "inactive", value: "false" },
            ]}
            optionLabel="name"
            placeholder={status.name ? status.name : "Status"}
            className="w-10rem shadow-3"
          />
        </div>

        {/* Filter Search */}
        <div className="card flex flex-row justify-content-between gap-3">
          <div>
            <Dropdown
              value={size}
              onChange={(e) => {
                setSearchParams({
                  name: search || "",
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
          <form
            onSubmit={handleSubmit(onSubmitSearch)}
            className="flex flex-row gap-2"
          >
            {/* Form */}
            <div className="form-search">
              <IconField
                iconPosition="left"
                className="flex align-content-center"
              >
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText
                  {...register("search")}
                  className="p-inputtext-sm w-full h-auto border-0 shadow-3"
                  placeholder="Search"
                />
              </IconField>
            </div>
          </form>
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
            <Column field="bankName" header="Name" sortable></Column>
            <Column field="bankCode" header="Code" sortable></Column>
            {/* <Column
              field="status"
              header="Status"
              body={(data) => {
                if (data.status) {
                  return <Tag severity="success" value="active"></Tag>;
                } else {
                  return <Tag severity="danger" value="inactive"></Tag>;
                }
              }}
              sortable
            ></Column> */}
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
                  onClick={() => handlePreviousPage(search)}
                  icon="pi pi-angle-left"
                  text
                  raised
                  size="small"
                  severity="secondary"
                />
                {/* Pages */}
                <Button
                  onClick={() => navigatePage(search, 1)}
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
                  onClick={() => navigatePage(search, data.paging.totalPages)}
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
                  onClick={() => handleNextPage(search)}
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
