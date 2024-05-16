import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import AuthService from "@services/AuthService";
import UserService from "@services/UserService";
import Notification from "@shared/components/Notification/Notification";

// create schema update for validator with zod
const schemaUpdate = z.object({
  id: z.string(),
  name: z.string().min(4, { message: "Name must be at least 4 characters" }),
  birthDate: z.date(),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(13, { message: "Phone number must be at most 13 digits" }),
  ktpNumber: z
    .string()
    .min(16, { message: "KTP number must be 16 digits" })
    .max(16, { message: "KTP number must be 16 digits" }),
  address: z
    .string()
    .min(10, { message: "Username must be at least 10 characters" }),
});

// create schema add for validator with zod
const schemaAdd = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[A-Z])(?=.*\d).*$/, {
      message:
        "Password must contain at least one uppercase letter and one number",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .refine((email) => email.includes("@"), {
      message: 'Email must contain "@" symbol',
    }),
  name: z.string().min(4, { message: "Name must be at least 4 characters" }),
  birthDate: z.date(),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(13, { message: "Phone number must be at most 13 digits" }),
  ktpNumber: z
    .string()
    .min(16, { message: "KTP number must be 16 digits" })
    .max(16, { message: "KTP number must be 16 digits" }),
  address: z
    .string()
    .min(10, { message: "Username must be at least 10 characters" }),
});

export default function CustomerForm() {
  // use service or shared component with useMemo -> prevent re-render
  const authService = useMemo(() => AuthService(), []);
  const userService = useMemo(() => UserService(), []);
  const notification = useMemo(() => Notification(), []);

  // use state for date
  const [selectedDate, setSelectedDate] = useState();

  // use search params for id
  const { id } = useParams();

  // use navigate hook -> redirect
  const navigate = useNavigate();

  // access the client
  const queryClient = useQueryClient();

  // use state for visible password
  const [visiblePassword, setVisiblePassword] = useState(false);

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

  // register customer -> useMutation react query
  const { mutate: serviceCustomer, isPending } = useMutation({
    mutationFn: async (payload) => {
      if (payload.id) {
        // update customer
        return await userService.updateCustomer(payload);
      } else {
        // add customer
        return await authService.registerCustomer(payload);
      }
    },
    onSuccess: () => {
      // notification
      notification.showSuccess(
        id
          ? "Update customer success !"
          : "Register customer success, account created !"
      );

      // update cache tables
      queryClient.invalidateQueries({ queryKey: ["customers"] });

      // redirect
      navigate("/dashboard/user/customer");
    },
    onError: (error) => {
      // data already exists
      if (error.response.data.message === "Username already exists") {
        // notification
        notification.showError(
          "Username already exists, please choose another !"
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
      } else if (error.response.data.message === "Ktp number already exists") {
        // notification
        notification.showError(
          "Ktp number already exists, please choose another !"
        );
      } else {
        // notification
        notification.showError(
          id
            ? "Update customer failed, please try again !"
            : "Add customer failed, please try again !"
        );
      }
    },
  });

  // get customer by id
  useEffect(() => {
    // update form
    if (id) {
      const getCustomerById = async () => {
        try {
          // set data to form
          const response = await userService.getCustomerById(id);
          const currentCustomer = response.data;
          setValue("id", currentCustomer.id);
          setValue("name", currentCustomer.name);
          setValue("ktpNumber", currentCustomer.ktpNumber);
          setValue("phoneNumber", currentCustomer.phoneNumber);
          setValue("address", currentCustomer.address);
          setValue("birthDate", new Date(currentCustomer.birthDate));
          setSelectedDate(new Date(currentCustomer.birthDate));
        } catch (error) {
          console.log(error);
        }
      };
      getCustomerById();
    }
  }, [id, userService, setValue]);

  // handle submit
  const onSubmit = (data) => {
    // service customer -> useMutation react query
    serviceCustomer(data);
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
                {id ? "Update" : "Add"} customer account.
              </h2>
              <p className="text-sm text-gray-400">
                {id
                  ? "Enter data customer to update an customer profile."
                  : "Enter customer username, password and data to create an account."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-5">
                {/* Username */}
                <div className={`p-inputgroup flex-1 ${id ? "hidden" : ""}`}>
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                  </span>
                  <InputText
                    {...register("username")}
                    id="username"
                    placeholder="Username"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="username-help"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Error Username */}
                {errors.username && (
                  <small id="username-help" className="text-xs p-error">
                    {errors.username.message}
                  </small>
                )}

                {/* Password */}
                <div
                  className={`p-inputgroup flex-1 mt-3 ${id ? "hidden" : ""}`}
                >
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-lock"></i>
                  </span>
                  <InputText
                    {...register("password")}
                    id="password"
                    type={visiblePassword ? "text" : "password"}
                    placeholder="Password"
                    variant="filled"
                    className="p-inputtext-sm w-full"
                    aria-describedby="password-help"
                    onKeyDown={handleKeyDown}
                  />

                  {/* Button Visibility Password */}
                  <span
                    onClick={() => setVisiblePassword(!visiblePassword)}
                    className="p-inputgroup-addon cursor-pointer p-0"
                  >
                    <i
                      className={
                        visiblePassword ? "pi pi-eye-slash" : "pi pi-eye"
                      }
                    ></i>
                  </span>
                </div>

                {/* Error Password */}
                {errors.password && (
                  <small id="password-help" className="text-xs p-error">
                    {errors.password.message}
                  </small>
                )}

                {/* Email */}
                <div
                  className={`p-inputgroup flex-1 mt-3 ${id ? "hidden" : ""}`}
                >
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-at"></i>
                  </span>
                  <InputText
                    {...register("email")}
                    id="email"
                    placeholder="Email Address"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="email-help"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Error Email */}
                {errors.email && (
                  <small id="email-help" className="text-xs p-error">
                    {errors.email.message}
                  </small>
                )}

                {/* Name */}
                <div className="p-inputgroup flex-1 mt-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
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
                </div>

                {/* Error Name */}
                {errors.name && (
                  <small id="name-help" className="text-xs p-error">
                    {errors.name.message}
                  </small>
                )}

                {/* KTP Number */}
                <div className="p-inputgroup flex-1 mt-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-id-card"></i>
                  </span>
                  <InputText
                    {...register("ktpNumber")}
                    id="ktpNumber"
                    type="number"
                    placeholder="KTP Number"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="ktpNumber-help"
                  />
                </div>

                {/* Error KTP Number */}
                {errors.ktpNumber && (
                  <small id="ktpNumber-help" className="text-xs p-error">
                    {errors.ktpNumber.message}
                  </small>
                )}

                {/* Mobile Phone */}
                <div className="p-inputgroup flex-1 mt-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-mobile"></i>
                  </span>
                  <InputText
                    {...register("phoneNumber")}
                    id="phoneNumber"
                    type="number"
                    placeholder="Mobile Phone"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="phoneNumber-help"
                  />
                </div>

                {/* Error Mobile Phone */}
                {errors.phoneNumber && (
                  <small id="phoneNumber-help" className="text-xs p-error">
                    {errors.phoneNumber.message}
                  </small>
                )}

                {/* Birth Date */}
                <div className="p-inputgroup flex-1 mt-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-calendar"></i>
                  </span>
                  <Calendar
                    {...register("birthDate")}
                    id="birthDate"
                    placeholder={
                      selectedDate
                        ? new Date(selectedDate).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })
                        : "Birth Date"
                    }
                    variant="filled"
                    className="p-inputtext-sm w-full"
                    aria-describedby="birthDate-help"
                    dateFormat="dd/mm/yy"
                  />
                </div>

                {/* Error Birth Date */}
                {errors.birthDate && (
                  <small id="birthDate-help" className="text-xs p-error">
                    {errors.birthDate.message}
                  </small>
                )}

                {/* Address */}
                <div className="p-inputgroup flex-1 mt-3">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-map"></i>
                  </span>
                  <InputText
                    {...register("address")}
                    id="address"
                    placeholder="Address"
                    variant="filled"
                    className="p-inputtext-sm w-full lg:w-10"
                    aria-describedby="address-help"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Error Address */}
                {errors.address && (
                  <small id="address-help" className="text-xs p-error">
                    {errors.address.message}
                  </small>
                )}

                {/* Modal Button */}
                <div className="flex flex-row justify-content-end gap-2">
                  {/* Cancel Button */}
                  <Link to="/dashboard/user/customer">
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
