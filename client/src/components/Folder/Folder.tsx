import type { FolderType } from "../Authentication/types/User";
import { FaFolder } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IoShareOutline } from "react-icons/io5";
import styles from "./Folder.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

type FolderProps = {
  folder: FolderType;
};

function Folder({ folder }: FolderProps) {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const openFolderHandler = () => {
    navigate(`/${folder.id}`);
  };

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  // Closes menu when user clicks anywhere outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteFolder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/folders/delete-folder/${
          folder.id
        }`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const shareFolder = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`http://localhost:5173/share/${id}`);
      alert("Link to share folder copied to ClipBoard");
      toggleOptions();
    } catch (err) {
      console.error("Failed to copy Link to clipboard: ", err);
    }
  };

  return (
    <div
      className={styles.folderWrapper}
      onDoubleClick={openFolderHandler}
      ref={menuRef}
    >
      <FaFolder size="1.8em" color="#f4b400" />
      <p title={folder.name}>{folder.name}</p>
      <IoMenu size={"1.5em"} className={styles.menu} onClick={toggleOptions} />
      {showOptions && (
        <div className={styles.optionsMenu}>
          <button
            className={styles.optionDelete}
            onClick={(e) => handleDeleteFolder(e)}
          >
            <RiDeleteBin5Line size={"1.3em"} />
            <span>Delete Folder</span>
          </button>
          <button
            className={styles.optionShare}
            onClick={() => shareFolder(folder.id)}
          >
            <IoShareOutline size={"1.3em"} />
            <span>Share Folder</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Folder;
