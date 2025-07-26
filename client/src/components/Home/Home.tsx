import { useAuth } from "../Authentication/useAuth";
import styles from "./Home.module.css";

function Home() {
  const { user } = useAuth();

  // GET USER
  return (
    <div className={styles.pageWrapper}>
      <h2>{user?.folders?.[0]?.name ?? "No folder found"}</h2>
      <p>Display Folders</p>
      <p>Display Files</p>
    </div>
  );
}

export default Home;
