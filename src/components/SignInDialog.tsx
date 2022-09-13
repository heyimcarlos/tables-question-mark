import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import Modal from "@/components/Modal";
import SignInForm from "./forms/SignIn";
import Image from "next/image";

const SignInDialog = () => {
  const [open, setOpen] = useState(false);

  const toggleDialog = () => {
    setOpen(!open);
  };

  return (
    <>
      <button
        type="button"
        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        onClick={() => setOpen(true)}
      >
        Iniciar sesión
      </button>

      <Modal open={open} onClose={toggleDialog}>
        <div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
              <Image src="/logo.png" alt="logo" width={160} height={64} />
            </Dialog.Title>
            <div className="mt-2 mb-4">
              <p className="text-sm text-gray-500">
                Ingrese su usuario y contraseña para iniciar sesión
              </p>
            </div>
          </div>
        </div>
        <SignInForm />
        <div className="mt-5 sm:mt-6">
          {/* <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            onClick={toggleDialog}
          >
            Proceder
          </button> */}
        </div>
      </Modal>
    </>
  );
};

export default SignInDialog;
