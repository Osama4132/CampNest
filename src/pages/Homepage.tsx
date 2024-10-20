import { Link } from "react-router-dom";
import styles from "../styles/homepage.module.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <div
        className={`${styles.homepageWrapper} d-flex text-center bg-dark justify-content-center`}
      >
        <Navbar styles={styles} />
        <div
          className={`${styles.coverContainer} d-flex w-100 h-100 p-3 mx-auto flex-column text-white`}
        >
          <header className="mb-auto"></header>
          <main className="px-3">
            <h1>CampNest</h1>
            <p className="lead">
              Welcome to CampNest! <br /> Jump right in and explore our many
              campgrounds. <br />
              Feel free to share some of your own and comment on others!
            </p>
            <Link
              to="/campgrounds"
              className={`${styles.btnSecondaryBS} btn btn-lg btn-secondary font-weight-bold border-white bg-white`}
            >
              <strong>View Campgrounds</strong>
            </Link>
          </main>
          <Footer styles={styles} />
        </div>
      </div>
    </>
  );
}
