import { Link } from "react-router-dom";
import { useAuth } from "../Authentication/useAuth.jsx";
import LogOut from "../Authentication/LogOut/LogOut.jsx";
import style from "./NavBar.module.css";

type NavBarProps = {
  openDialogNewFolder: () => void;
  openDialogUploadFile: () => void;
};

function NavBar({ openDialogNewFolder, openDialogUploadFile }: NavBarProps) {
  const { user, loading, isAuthenticated } = useAuth();

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
