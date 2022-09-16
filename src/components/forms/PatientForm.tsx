import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/router";
import Image from "next/image";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { trpc } from "@/utils/trpc";
import Modal from "../Modal";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";

const FormSchema = z.object({
  name: z.string().min(1, "Requerido"),
  lastName: z.string().min(1, "Requerido"),
  email: z.string().min(1, "Requerido").email("Correo electrónico inválido"),
  address: z.string().min(10, "Requerido"),
  phone: z
    .string({ required_error: "Requerido" })
    .min(12, "Número de teléfono inválido")
    .max(12, "Número de teléfono inválido"),
});

type FormValues = z.infer<typeof FormSchema>;

const ForwardedPhoneInput = React.forwardRef<HTMLInputElement>((props, ref) => (
  <input
    ref={ref}
    {...props}
    name="phone"
    type="tel"
    autoComplete="phone"
    className="border-gray-300 rounded w-full focus:border-indigo-500 focus:ring-indigo-500"
  />
));

ForwardedPhoneInput.displayName = "Input";

const ErroMessage = (message: string) => <span className="text-sm text-red-500">{message}</span>;

const PatientForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    // mode: "all",
  });

  const mutation = trpc.useMutation("patient.public.create-record", {
    onError: (error) => {
      setErrorMessage(error.message);
    },
    onSuccess: () => {
      toggleModal();
      reset();
      utils.invalidateQueries(["user.records"]);
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    mutation.mutate(values);

    // push to success page
    // router.push("/exito");
  };

  const toggleModal = () => {
    setShow(!show);
  };

  const modal = (
    <Modal open={show} onClose={toggleModal}>
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            ¡Gracias por registrarte!
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Tu registro ha sido exitoso, en breve estaremos trabajando contigo.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          onClick={toggleModal}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );

  return (
    <>
      {show && modal}
      <div className="mt-3 text-center sm:mt-5">
        <Image src="/logo.png" alt="logo" width={160} height={64} />
        <div className="mt-2 mb-4">
          <h1 className="text-xl text-gray-500">Registro previo a cita</h1>
        </div>
      </div>
      <div className="border p-4 rounded">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Información Personal</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Utilize solo información real para evitar problemas con su cita.
            </p>
          </div>
        </div>
        <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
              <div className="space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Nombre
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Maria"
                      name="name"
                      id="name"
                      autoComplete="given-name"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    />
                    {errors.name?.message && ErroMessage(errors.name.message)}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Apellido
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      {...register("lastName")}
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Perez"
                      autoComplete="family-name"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    />
                    {errors.lastName?.message && ErroMessage(errors.lastName.message)}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Correo electrónico
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      lang="ES"
                      {...register("email")}
                      id="email"
                      name="email"
                      placeholder="mariaperez@gmail.com"
                      onInvalid={(e) =>
                        e.currentTarget.setCustomValidity(
                          "Por favor incluya una '@' en la dirección de correo electrónico."
                        )
                      }
                      onInvalidCapture={() => "hello"}
                      type="email"
                      autoComplete="email"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    />
                    {errors.email?.message && ErroMessage(errors.email.message)}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Teléfono
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Controller
                      name="phone"
                      control={control}
                      rules={{ validate: (value) => isValidPhoneNumber(value) }}
                      render={({ field: { value, onChange } }) => (
                        <PhoneInput
                          placeholder="809-111-1111"
                          inputComponent={ForwardedPhoneInput}
                          value={value}
                          onChange={onChange}
                          defaultCountry="DO"
                          limitMaxLength
                          className="block w-full max-w-lg rounded-md   pl-2 sm:max-w-xs sm:text-sm"
                        />
                      )}
                    />
                    {errors.phone?.message && ErroMessage(errors.phone.message)}
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Dirección
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      placeholder="Calle 27 de febrero, Santo Domingo"
                      {...register("address")}
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.address?.message && ErroMessage(errors.address.message)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PatientForm;
