import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import { Skeleton } from "primereact/skeleton";
import { Image } from "primereact/image";

import InventoryService from "@services/InventoryService";
import Notification from "@shared/components/Notification/Notification";
import NumberFormatter from "@shared/utils/NumberFormatter";

// create schema search for validator with zod
const schema = z.object({
  search: z.optional(z.string()),
});

export default function InventoryList() {
  // access the client
  const queryClient = useQueryClient();

  // use state for data tables and search params
  const [searchParams, setSearchParams] = useSearchParams();

  // use service and utils with useMemo -> prevent re-render
  const inventoryService = useMemo(() => InventoryService(), []);
  const notification = useMemo(() => Notification(), []);
  const numberFormatter = useMemo(() => NumberFormatter(), []);

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

  // update status inventory -> useMutation react query
  const { mutate: updateStatusInventory } = useMutation({
    mutationFn: async (id, status) => {
      // update inventory
      return await inventoryService.updateStatusInventoryById(id, status);
    },
    onSuccess: () => {
      // notification
      notification.showSuccess("Update stuff status success !");

      // update cache tables
      queryClient.invalidateQueries({ queryKey: ["stuffs"] });
    },
    onError: () => {
      // notification
      notification.showError("Update inventory status failed !");
    },
  });

  // get all inventory -> react query
  const { data, isLoading } = useQuery({
    queryKey: ["stuffs", search, status, page, size],
    queryFn: async () => {
      return await inventoryService.getAllInventory({
        name: search,
        status: status,
        page: page,
        size: size,
      });
    },
  });

  // loading get all inventory -> react query
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

  // image column table
  const imageBodyTemplate = (rowData) => {
    return (
      <div>
        <Image
          src={rowData.image.url}
          alt={rowData.name}
          width="100"
          height="100"
          preview
          className="border-round shadow-3"
        />
      </div>
    );
  };

  // action column table
  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="flex flex-row gap-3">
          {/* Edit */}
          <Link to={`/dashboard/inventory/update/${rowData.id}`}>
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
          {rowData.status ? (
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
          )}
        </div>
      </div>
    );
  };

  // accept update status
  const accept = (rowData) => {
    const payload = {
      id: rowData.id,
      status: !rowData.status,
    };

    // update status inventory -> useMutation react query
    updateStatusInventory(payload);
  };

  // confirm update status
  const confirmStatus = (rowData) => {
    confirmDialog({
      message: "Are you sure you want to update status ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => accept(rowData),
    });
  };

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

        {/* Filter */}
        <div className="card flex flex-row justify-content-between gap-3">
          {/* Size */}
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

          {/* Search */}
          <form
            onSubmit={handleSubmit(onSubmitSearch)}
            className="flex flex-row gap-2"
          >
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
        <div className="card mt-4 shadow-3">
          <DataTable
            value={data.data}
            stripedRows
            style={{ maxWidth: "58rem" }}
          >
            <Column
              body={(data, props) => {
                if (page == 1) {
                  return (props.rowIndex += 1);
                } else {
                  return (props.rowIndex += size * (page - 1) + 1);
                }
              }}
            ></Column>
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column field="stuffName" header="Name" sortable></Column>
            <Column field="weight" header="Weight" sortable></Column>
            <Column field="buyingPrice" header="Buying Price"       body={(data) => {
                return numberFormatter.formatRupiah(data.buyingPrice);
              }} sortable></Column>
            <Column
              field="sellingPrice"
              header="Selling Price"
              body={(data) => {
                return numberFormatter.formatRupiah(data.sellingPrice);
              }}
              sortable
            ></Column>
            <Column
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
            ></Column>
            <Column body={actionBodyTemplate} header="Action"></Column>
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
