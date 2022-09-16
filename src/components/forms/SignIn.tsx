import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/router";
import Image from "next/image";

const FormSchema = z.object({
  username: z.string().min(6, "Campo obligatorio"),
  password: z.string().min(6, "Campo obligatorio"),
});

type FormValues = z.infer<typeof FormSchema>;

const SignInForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "all",
  });

  const onSubmit: SubmitHandler<FormValues> = async (credentials) => {
    const res = await signIn("credentials", { ...credentials, redirect: false });

    if (!res) {
      setErrorMessage("Ha occurido un error al iniciar sesión");
    } else if (!res.error) {
      router.push("/tablero");
    } else {
      setErrorMessage("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      <div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            <Image src="/logo.png" alt="logo" width={160} height={64} />
          </h3>
          <div className="mt-2 mb-4">
            <p className="text-sm text-gray-500">
              Ingrese su usuario y contraseña para iniciar sesión
            </p>
          </div>
        </div>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* TODO: Provides a list of providers, do we need it?. */}
        {/* <input defaultValue={csrfToken || undefined} type="hidden" hidden /> */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <div className="mt-1">
            <input
              id="username"
              disabled={isSubmitting}
              {...register("username", { required: true })}
              autoComplete="username"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {errors.username && (
              <span className="text-sm text-red-500">{errors.username.message}</span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              disabled={isSubmitting}
              {...register("password", { required: true })}
              autoComplete="current-password"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />

            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>
        </div>

        {/* <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div> */}
        {errorMessage && <span className="text-sm text-red-500">{errorMessage}</span>}
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </>
  );
};

export default SignInForm;
