import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useRef } from "react";

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
  let folderId = useParams().folderid;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitNewFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // fetch folder id if file is added to root folder
    if (!folderId) {
      const result = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/folders/get-home-folder-id`,
        {
          credentials: "include",
        }
      );

      const data = await result.json();

      if (result.ok) {
        folderId = data.rootFolderId;
      }
    }

    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from("files")
      .upload(`folder-${folderId}/${file.name}`, file);

    if (error) {
      console.error("Upload error:", error);
      return;
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from("files")
      .getPublicUrl(`folder-${folderId}/${file.name}`);

    const fileUrl = publicUrlData?.publicUrl;

    // Save metadata in your backend
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/file/upload-new`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          url: fileUrl,
          folderId,
        }),
      }
    );

    if (res.ok) {
      console.log("File metadata saved!");
      const { file } = await res.json();
      if (file) {
        closeDialogUploadFile();
        navigate(0);
      }
    } else {
      console.error("Failed to save file info");
    }
  };

  return (
    <dialog open={isOpen} onClose={closeDialogUploadFile} ref={dialogRef}>
      <form onSubmit={handleSubmitNewFile}>
        <h2>Upload New File</h2>
        <label htmlFor="file">Pick File</label>
        <input type="file" name="file" id="file" ref={fileInputRef} />
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
