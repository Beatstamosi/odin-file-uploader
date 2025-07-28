import type { FolderType } from "../Authentication/types/User";
import { FaFolder } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import styles from "./Folder.module.css";
import { useNavigate } from "react-router-dom";

type FolderProps = {
  folder: FolderType;
};

// TODO: Add functionality to IoMenu button
// Add functionality to doubleclick

function Folder({ folder }: FolderProps) {
  const navigate = useNavigate();

  const openFolderHandler = () => {
    navigate(`/${folder.id}`);
  };

  return (
    <div className={styles.folderWrapper} onDoubleClick={openFolderHandler}>
      <FaFolder size={"1.5em"} />
      <p>{folder.name}</p>
      <IoMenu size={"1.5em"} className={styles.menu} />
    </div>
  );
}

export default Folder;
