import { useState } from "react";

function useDialog(dialogRef: React.RefObject<HTMLDialogElement | null>) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    setIsOpen(false);
    dialogRef.current?.close();
  };

  return { isOpen, openDialog, closeDialog };
}

export default useDialog;
