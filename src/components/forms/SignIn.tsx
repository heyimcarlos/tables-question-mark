import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = { username: string; password: string };

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data, e) => console.log(data, e);

  //   console.log(watch("username")); // watch input value by passing the name of it

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Usuario
        </label>
        <div className="mt-1">
          <input
            id="username"
            {...register("username", { required: true, minLength: 6 })}
            autoComplete="username"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.username && <span className="text-sm text-red-500">Campo obligatorio</span>}
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
            {...register("password", { required: true, minLength: 6 })}
            autoComplete="current-password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />

          {errors.password && <span className="text-sm text-red-500">Campo obligatorio</span>}
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

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Iniciar sesión
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
{
  /* <form onSubmit={onSubmit}>
       <input defaultValue="test" {...register("username", { required: true })} />
       <input defaultValue="test" {...register("password", { required: true })} />
       {errors.username && <span>This field is required</span>}
       {errors.username && <span>This field is required</span>}
       <button
         type="submit"
         className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          onClick={toggleDialog}
       >
         Proceder
       </button>
     </form> */
}
