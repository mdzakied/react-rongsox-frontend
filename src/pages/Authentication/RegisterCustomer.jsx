import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import AuthService from "@services/AuthService";
import Notification from "@shared/components/Notification/Notification";

import Logo from "@/assets/images/rongsox-logo.png";
import HeroRegister from "@/assets/images/register-customer.png";

// create schema for validator with zod
const schema = z.object({
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
  mobilePhoneNo: z
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

export default function RegisterCustomer() {
  // use service or shared component with useMemo -> prevent re-render
  const authService = useMemo(() => AuthService(), []);
  const notification = useMemo(() => Notification(), []);

  // use navigate hook -> redirect
  const navigate = useNavigate();

  // use state
  const [visiblePassword, setVisiblePassword] = useState(false);

  // use form hook with schema from zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // register customer -> useMutation react query
  const { mutate: registerCustomer, isPending } = useMutation({
    mutationFn: async (payload) => {
      // login
      return await authService.registerCustomer(payload);
    },
    onSuccess: () => {
      // notification
      notification.showSuccess("Register customer success, account created !");

      // redirect
      // navigate("/dashboard");
    },
    onError: (error) => {
      // data already exists
      if (error.response.data.message === "Data already exist") {
        // notification
        notification.showError("Username already exists !");
      } else {
        // notification
        notification.showError("Register customer failed, please try again !");
      }
    },
  });

  const onSubmit = (data) => {
    // register admin -> useMutation react query
    registerCustomer(data);

    // reset form
    reset();
  };

  return (
    <>
      {/* Register Page */}
      <div id="registerCustomerPage">
        <div className="flex flex-row justify-content-center align-items-center flex-wrap h-screen">
          <div className="grid w-full align-items-center ">
            {/* Register Form */}
            <div className="col-12 md:col-6 md:px-6 lg:px-8">
              {/* Logo */}
              <div className="mb-2">
                <img src={Logo} alt="logo" className="w-8rem" />
              </div>

              {/* Title */}
              <div className="ml-1">
                <h2 className="font-semibold my-0">
                  Sign Up to customer account.
                </h2>
                <p className="text-sm text-gray-400">
                  Enter customer username, password and data to sign up.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-inputgroup-customer mt-4">
                  {/* Username */}
                  <div className="p-inputgroup flex-1">
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
                    />
                  </div>

                  {/* Error Username */}
                  {errors.username && (
                    <small id="username-help" className="text-xs p-error">
                      {errors.username.message}
                    </small>
                  )}

                  {/* Password */}
                  <div className="p-inputgroup flex-1 mt-2">
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
                  <div className="p-inputgroup flex-1 mt-3">
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
                    />
                  </div>

                  {/* Error Email */}
                  {errors.email && (
                    <small id="email-help" className="text-xs p-error">
                      {errors.email.message}
                    </small>
                  )}

                  {/* Name */}
                  <div className="p-inputgroup flex-1 mt-2">
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

                  {/* Birth Date */}
                  <div className="p-inputgroup flex-1 mt-2">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-calendar"></i>
                    </span>
                    <Calendar
                      {...register("birthDate")}
                      id="birthDate"
                      placeholder="Birth Date"
                      variant="filled"
                      className="p-inputtext-sm w-full"
                      aria-describedby="birthDate-help"
                    />
                  </div>

                  {/* Error Birth Date */}
                  {errors.birthDate && (
                    <small id="birthDate-help" className="text-xs p-error">
                      {errors.birthDate.message}
                    </small>
                  )}

                  {/* Mobile Phone */}
                  <div className="p-inputgroup flex-1 mt-3">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-mobile"></i>
                    </span>
                    <InputText
                      {...register("mobilePhoneNo")}
                      id="mobilePhoneNo"
                      type="number"
                      placeholder="Mobile Phone"
                      variant="filled"
                      className="p-inputtext-sm w-full lg:w-10"
                      aria-describedby="mobilePhoneNo-help"
                    />
                  </div>

                  {/* Error Mobile Phone */}
                  {errors.mobilePhoneNo && (
                    <small id="mobilePhoneNo-help" className="text-xs p-error">
                      {errors.mobilePhoneNo.message}
                    </small>
                  )}

                  {/* Adress */}
                  <div className="p-inputgroup flex-1 mt-2">
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
                    />
                  </div>

                  {/* Error Adress */}
                  {errors.address && (
                    <small id="address-help" className="text-xs p-error">
                      {errors.address.message}
                    </small>
                  )}

                  {/* Register Button */}
                  <div>
                    <Button
                      label={isPending ? "Loading..." : "Sign Up"}
                      className="bgn-success w-full mt-3 py-2"
                      severity="success"
                      size="small"
                      disabled={!isValid || isPending}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Image Ilustration */}
            <div className="col-12 md:col-6 hidden md:flex align-items-center">
              <img src={HeroRegister} alt="HeroRegister" className="w-10" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
