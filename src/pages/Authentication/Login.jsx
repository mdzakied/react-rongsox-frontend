import { useState } from "react";
import { useForm } from "react-hook-form";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Notification from "@shared/components/Notification";

import Logo from "@/assets/images/rongsox-logo.png";
import HeroLogin from "@/assets/images/recycle.png";

// create schema for validator with zod
const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .refine((email) => email.includes("@"), {
      message: 'Email must contain "@" symbol',
    }),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  // use service or shared component with useMemo -> prevent re-render
  const notification = Notification();

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

  const onSubmit = (data) => {
    if (data.email === "superadmin@rongsox" && data.password === "12345678") {
      notification.showSuccess("Login Success");
    } else {
      notification.showError("Login Failed");
    }
    // reset();
  };

  return (
    <>
      {/* Toast Notification */}
      {notification.ToastComponent}

      {/* Login Page */}
      <div id="loginPage">
        <div className="flex flex-row justify-content-center align-items-center flex-wrap h-screen">
          <div className="grid w-full align-items-center ">
            {/* Login Form */}
            <div className="col-12 md:col-6 md:px-6 lg:px-8">
              {/* Logo */}
              <div className="mb-4">
                <img src={Logo} alt="logo" className="w-8rem" />
              </div>

              {/* Title */}
              <div className="ml-1">
                <h2 className="font-semibold my-0">Log in to your account.</h2>
                <p className="text-sm text-gray-400">
                  Enter your email address and password to log in.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-5">
                  {/* Email */}
                  <div className="p-inputgroup flex-1">
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

                  {/* Password */}
                  <div className="p-inputgroup flex-1 cursor-pointer mt-3">
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
                      className="p-inputgroup-addon p-0"
                    >
                      <i
                        className={
                          visiblePassword ? "pi pi-eye-slash" : "pi pi-eye"
                        }
                      ></i>
                    </span>
                  </div>

                  {/* Error Email */}
                  {errors.password && (
                    <small id="password-help" className="text-xs p-error">
                      {errors.password.message}
                    </small>
                  )}

                  {/* Login Button */}
                  <div>
                    <Button
                      label="Login"
                      className="bgn-success w-full mt-4 py-2"
                      severity="success"
                      size="small"
                      disabled={!isValid}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Image Ilustration */}
            <div className="col-12 md:col-6 hidden md:flex align-items-center">
              <img src={HeroLogin} alt="logo" className="w-10" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
