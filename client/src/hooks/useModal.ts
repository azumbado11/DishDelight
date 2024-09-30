import { useRef, useState } from "react";

export const useModal = () => {
  const [modal, setModal] = useState<{ title: string; message: string } | null>(
    null
  );
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const showModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  return {
    modal,
    setModal,
    dialogRef,
    showModal,
    closeModal,
  };
};
