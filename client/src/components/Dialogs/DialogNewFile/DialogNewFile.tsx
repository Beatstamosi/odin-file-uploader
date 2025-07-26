type DialogUploadFileProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  closeDialogUploadFile: () => void;
};

function DialogUploadFile({
  dialogRef,
  isOpen,
  closeDialogUploadFile,
}: DialogUploadFileProps) {
  return (
    <dialog open={isOpen} onClose={closeDialogUploadFile} ref={dialogRef}>
      <form action="">
        <h2>Upload New File</h2>
        <label htmlFor="file">Pick File</label>
        <input type="file" name="file" id="file" />
        <div>
          <button type="submit">Upload</button>
          <button type="button" onClick={closeDialogUploadFile}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default DialogUploadFile;
