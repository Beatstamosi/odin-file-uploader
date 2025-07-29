import { useEffect, useState } from "react";
import styles from "./FolderContent.module.css";
import { useNavigate, useParams } from "react-router-dom";
import type { FolderType } from "../Authentication/types/User";
import FolderPath from "../FolderPath/FolderPath";
import Folder from "../Folder/Folder.js";
import File from "../File/File.js";

function FolderContent() {
  const [folder, setFolder] = useState<FolderType>();
  const navigate = useNavigate();
  const params = useParams().folderid;

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/folders/get-folder/${params}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
          }
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

  // DISPLAY FOLDER CONTENTS & PATH
  // MAP THROUGH CHILDREN AND DISPLAY FOLDER COMPONENT
  // MAP THROUGH FILES AND DISPLAY FILE COMPONENTS

  return (
    <div className={styles.pageWrapper}>
      {folder && <FolderPath folder={folder} />}
      <div className={styles.folderWrapper}>
        {folder?.children?.map((folder) => (
          <Folder key={folder.id} folder={folder} />
        ))}
      </div>
      <div className={styles.folderWrapper}>
        {folder?.files?.map((file) => (
          <File key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}

export default FolderContent;
