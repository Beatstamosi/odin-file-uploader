import { useState } from "react";
import { useNavigate } from "react-router-dom";

type DialogNewFolderProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  isOpen: boolean;
  closeDialogNewFolder: () => void;
};

type returnDataFromAPI = {
  folder: {
    id: string;
    name: string;
    parentFolderId: string | null;
    ownerId: string;
  };
};

function DialogNewFolder({
  dialogRef,
  isOpen,
  closeDialogNewFolder,
}: DialogNewFolderProps) {
  const [folderName, setFolderName] = useState("");
  const navigate = useNavigate();

  const handleSubmitNewFolder = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/folders/create-new`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: folderName,
          }),
        }
      );

      const data: returnDataFromAPI = await res.json();

      if (res.ok) {
        navigate(`/${data.folder.id}`);
        console.log("Folder created!");
      } else {
        throw new Error("Server Error creating folder");
      }
    } catch (err) {
      console.log("Error creating folder: ", err);
    }
  };

  return (
    <dialog open={isOpen} onClose={closeDialogNewFolder} ref={dialogRef}>
      <form onSubmit={handleSubmitNewFolder}>
        <h2>Create New Folder</h2>
        <label htmlFor="folderName">Folder Name</label>
        <input
          type="text"
          name="folderName"
          id="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
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
