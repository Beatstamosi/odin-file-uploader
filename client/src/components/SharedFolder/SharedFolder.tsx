import type { FolderType } from "../Authentication/types/User";
import { FaFolder } from "react-icons/fa";
import styles from "./SharedFolder.module.css";
import { useNavigate } from "react-router-dom";

type FolderProps = {
  folder: FolderType;
};

function SharedFolder({ folder }: FolderProps) {
  const navigate = useNavigate();

  const openFolderHandler = () => {
    navigate(`/share/${folder.id}`);
  };

  return (
    <div className={styles.folderWrapper} onDoubleClick={openFolderHandler}>
      <FaFolder size="1.8em" color="#f4b400" />
      <p title={folder.name}>{folder.name}</p>
    </div>
  );
}

export default SharedFolder;
