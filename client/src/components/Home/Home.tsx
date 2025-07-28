import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import type { FolderType } from "../Authentication/types/User";
import FolderPath from "../FolderPath/FolderPath";
import Folder from "../Folder/Folder.js";

function Home() {
  const [folder, setFolder] = useState<FolderType>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/folders/get-home-folder`,
          {
            method: "GET",
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
  }, [navigate]);

  return (
    <div className={styles.pageWrapper}>
      {folder && <FolderPath folder={folder} />}
      <div className={styles.folderWrapper}>
        {folder?.children?.map((folder) => (
          <Folder key={folder.id} folder={folder} />
        ))}
      </div>
      <p>Display Files</p>
    </div>
  );
}

export default Home;
