import { Outlet } from "react-router-dom";
import { useAuth } from "./components//Authentication/useAuth.jsx";
import NavBar from "./components/NavBar/NavBar.js";
import { useRef } from "react";
import DialogNewFolder from "./components/Dialogs/DialogNewFolder/DialogNewFolder.js";
import useDialog from "./components/Dialogs/useDialog.js";
import DialogUploadFile from "./components/Dialogs/DialogNewFile/DialogNewFile.js";

function App() {
  const { loading } = useAuth();

  // New Folder Dialog
  const dialogRefOpenNewFolder = useRef<HTMLDialogElement>(null);
  const {
    isOpen: isOpenDialogNewFolder,
    openDialog: openDialogNewFolder,
    closeDialog: closeDialogNewFolder,
  } = useDialog(dialogRefOpenNewFolder);

  // New File Upload Dialog
  const dialogRefUploadFile = useRef<HTMLDialogElement>(null);
  const {
    isOpen: isOpenDialogUploadFile,
    openDialog: openDialogUploadFile,
    closeDialog: closeDialogUploadFile,
  } = useDialog(dialogRefUploadFile);

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <NavBar openDialogNewFolder={openDialogNewFolder} openDialogUploadFile={openDialogUploadFile} />
      <DialogNewFolder
        dialogRef={dialogRefOpenNewFolder}
        isOpen={isOpenDialogNewFolder}
        closeDialogNewFolder={closeDialogNewFolder}
      />
      <DialogUploadFile
        dialogRef={dialogRefUploadFile}
        isOpen={isOpenDialogUploadFile}
        closeDialogUploadFile={closeDialogUploadFile}
      />
      <Outlet />
    </>
  );
}

export default App;
