import { useEffect, useState } from "react";
import type { FolderType } from "../Authentication/types/User";
import styles from "./FolderPath.module.css";

type FolderPathProps = {
  folder: FolderType;
};

function FolderPath({ folder }: FolderPathProps) {
  const [path, setPath] = useState("");

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/folders/${folder.id}/path`
        );

        const data = await res.json();

        if (res.ok) {
          setPath(data.path);
        } else {
          throw new Error("Error fetching path");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPath();
  });

  return <div className={styles.pathWrapper}>{path}</div>;
}

export default FolderPath;
