type DialogNewFolderProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  closeDialogNewFolder: () => void;
};

function DialogNewFolder({
  dialogRef,
  isOpen,
  closeDialogNewFolder,
}: DialogNewFolderProps) {
  return (
    <dialog open={isOpen} onClose={closeDialogNewFolder} ref={dialogRef}>
      <form action="">
        <h2>Create New Folder</h2>
        <label htmlFor="folderName">Folder Name</label>
        <input type="text" name="folderName" id="folderName" />
        <div>
          <button type="submit">Create</button>
          <button type="button" onClick={closeDialogNewFolder}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default DialogNewFolder;
