import React, { useState } from "react";
import Modal from "@/components/Modal";
import SignInForm from "./forms/SignIn";

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
        <SignInForm />
      </Modal>
    </>
  );
};

export default SignInDialog;
