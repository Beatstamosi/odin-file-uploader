import { useEffect, useState } from "react";
import type { FolderType } from "../Authentication/types/User";
import styles from "./FolderPath.module.css";
import { Link } from "react-router-dom";

type FolderPathProps = {
  folder: FolderType;
};

type Path = {
  name: string | undefined;
  id: string | undefined;
};

function FolderPath({ folder }: FolderPathProps) {
  const [path, setPath] = useState<Path[]>();

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/folders/${folder.id}/path`
        );

        const data = await res.json();

        if (res.ok) {
          setPath(data.folders);
        } else {
          throw new Error("Error fetching path");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPath();
  }, [folder.id]);

  return (
    <div className={styles.pathWrapper}>
      {path?.map((element, index) => (
        <span key={element.id} className={styles.pathElement}>
          <Link to={`/${element.id}`}>{element.name}</Link>
          {index < path.length - 1 && <span>{">"}</span>}
        </span>
      ))}
    </div>
  );
}

export default FolderPath;
