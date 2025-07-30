import { useEffect, useState } from "react";
import styles from "./SharedFolderContent.module.css";
import { useNavigate, useParams } from "react-router-dom";
import type { FolderType } from "../Authentication/types/User.js";
import SharedFolder from "../SharedFolder/SharedFolder.js";
import SharedFile from "../SharedFiles/SharedFile.js";

function SharedFolderContent() {
  const [folder, setFolder] = useState<FolderType>();
  const navigate = useNavigate();
  const params = useParams().folderId;

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/folders/get-shared-folder/${params}`
        );

        const data = await res.json();

        if (res.ok) {
          setFolder(data.folder);
        } else {
          navigate("/error");
        }
      } catch (err) {
        console.error("Error fetching folder: ", err);
      }
    };

    fetchFolder();
  }, [params, navigate]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.folderWrapper}>
        {folder?.children?.map((folder) => (
          <SharedFolder key={folder.id} folder={folder} />
        ))}
      </div>
      <div className={styles.folderWrapper}>
        {folder?.files?.map((file) => (
          <SharedFile key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}

export default SharedFolderContent;
