import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.pageWrapper}>
      <h2>Folder Path</h2>
      <p>Display Folders</p>
      <p>Display Files</p>
    </div>
  );
}

export default Home;
