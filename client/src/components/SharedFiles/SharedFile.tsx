import type { FileType } from "../Authentication/types/User";
import { FaFile } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { IoShareOutline } from "react-icons/io5";
import styles from "./SharedFile.module.css";
import { useState, useEffect, useRef } from "react";

type FileProps = {
  file: FileType;
};

function SharedFile({ file }: FileProps) {
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "blank"; // Suggests filename, browser may override
    document.body.appendChild(a);
    a.click();
    toggleOptions();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.folderWrapper} ref={menuRef}>
      <FaFile size={"1.5em"} />
      <div className={styles.fileInfo}>
        <p>{file.name}</p>
        <div>
          <p className={styles.info}>Size: {file.size / 1000} MB</p>
          <p className={styles.info}>
            Uploaded: {new Date(file.uploaded).toLocaleString()}
          </p>
        </div>
      </div>
      <IoMenu size={"1.5em"} className={styles.menu} onClick={toggleOptions} />
      {showOptions && (
        <div className={styles.optionsMenu}>
          <button
            className={styles.optionDownload}
            onClick={() => downloadFile(file.url, file.name)}
          >
            <IoShareOutline size={"1.3em"} />
            <span>Download File</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default SharedFile;
