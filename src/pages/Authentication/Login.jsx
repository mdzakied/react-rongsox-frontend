import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@tanstack/react-query";

import AuthService from "@services/AuthService";
import Notification from "@shared/components/Notification/Notification";

import Logo from "@/assets/images/rongsox-logo.png";
import HeroLogin from "@/assets/images/recycle.png";
import { useEffect } from "react";

// create schema for validator with zod
const schema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
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

  // login -> useMutation react query
  const { mutate: login, isPending } = useMutation({
    mutationFn: async (payload) => {
      // login
      return await authService.login(payload);
    },
    onSuccess: (data) => {
      // conditional redirect
      if (data && data.statusCode === 200) {
        // check role
        if (data.data.roles[0] === "ROLE_CUSTOMER") {
          // notification
          notification.showError("Access Denied, you are not authorized !");
        } else {
          // save user to local storage -> json stringify
          localStorage.setItem("user", JSON.stringify(data.data));

          // notification
          notification.showSuccess("Login success, welcome back !");

          navigate("/dashboard");
        }
      }
    },
    onError: (error) => {
      // data user disabled or incorrect username or password
      if (error && error.response.data.message === "User is disabled") {
        // notification
        notification.showError(
          "Your account is disabled, please contact super admin !"
        );
      } else {
        // notification
        notification.showError("Username or password is incorrect !");
      }
    },
  });

  const onSubmit = (data) => {
    // login -> useMutation react query
    login(data);

    // reset form
    reset();
  };

  // use effect -> check token always when service or route change
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const checkToken = async () => {
        const isValidToken = await authService.validateToken();

        if (isValidToken) {
          // notification
          notification.showSuccess("You are already logged in !");

          // redirect
          navigate("/dashboard");
        }
      };
      checkToken();
    }
  }, [authService, navigate, notification]);

  return (
    <>
      {/* Login Page */}
      <section id="loginPage">
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
                  Enter your username address and password to log in.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-5">
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
                  <div className="p-inputgroup flex-1 mt-3">
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

                  {/* Error Username */}
                  {errors.password && (
                    <small id="password-help" className="text-xs p-error">
                      {errors.password.message}
                    </small>
                  )}

                  {/* Login Button */}
                  <div>
                    <Button
                      label={isPending ? "Loading..." : "Login"}
                      className="bgn-success w-full mt-4 py-2"
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
              <img src={HeroLogin} alt="HeroLogin" className="w-10" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
