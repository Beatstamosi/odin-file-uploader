import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/useAuth";
import styles from "./FolderContent.module.css";
import { useNavigate, useParams } from "react-router-dom";
import type { Folder } from "../Authentication/types/User";

function FolderContent() {
  const { user } = useAuth();
  const [folder, setFolder] = useState<Folder[]>();
  const navigate = useNavigate();
  const params = useParams().folderid;

  console.log(params);

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

  console.log(folder);

  // DISPLAY FOLDER CONTENTS & PATH
  // BUILD PATH VIA parentfolders
  // MAP THROUGH CHILDREN AND DISPLAY FOLDER COMPONENT
  // MAP THROUGH FILES AND DISPLAY FILE COMPONENTS

  return (
    <div className={styles.pageWrapper}>
      <h2>Folder Content</h2>
      <h2>{user?.folders?.[0]?.name ?? "No folder found"}</h2>
      <p>Display Folders</p>
      <p>Display Files</p>
    </div>
  );
}

export default FolderContent;
