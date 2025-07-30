import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Authentication/useAuth.jsx";
import LogOut from "../Authentication/LogOut/LogOut.jsx";
import style from "./NavBar.module.css";
import { useEffect, useState } from "react";
import type { FolderType } from "../Authentication/types/User.js";

type NavBarProps = {
  openDialogNewFolder: () => void;
  openDialogUploadFile: () => void;
};

function NavBar({ openDialogNewFolder, openDialogUploadFile }: NavBarProps) {
  const { user, loading, isAuthenticated } = useAuth();
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

  const shareHomeFolder = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:5173/share/${folder?.id}`
      );
      alert("Link to share folder copied to ClipBoard");
    } catch (err) {
      console.error("Failed to copy Link to clipboard: ", err);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <div className={style.navBarWrapper}>
        <div>
          <h2>{user?.email || "No user found"}</h2>
        </div>
        <div className={style.navBarRightPart}>
          {!isAuthenticated && <Link to="/login">Log In</Link>}

          {isAuthenticated && (
            <>
              <button onClick={shareHomeFolder} className={style.btn}>
                Share Home Folder
              </button>
              <button onClick={openDialogNewFolder} className={style.btn}>
                New Folder
              </button>

              <button onClick={openDialogUploadFile} className={style.btn}>
                Upload File
              </button>

              <LogOut />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default NavBar;
