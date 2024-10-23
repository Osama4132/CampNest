import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CampgroundCard from "../components/CampgroundCard";
import styles from "../styles/navbar.module.css";
import { useEffect, useState } from "react";

export default function Newcampground() {
  const [allCampgrounds, setAllCampgrounds] = useState("");
  const [isloading, setIsLoading] = useState(true);

  const fetchAllCampgrounds = async () => {
    const info = await axios.get(`/api/campgrounds`);
    setAllCampgrounds(info.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllCampgrounds();
  }, []);
  return (
    <>
      {isloading === true ? (
        <h1>Loading campgrounds...</h1>
      ) : (
        <div className="vh-min-100">
          <Navbar styles={styles} />
          <main className={`mt-3 `}>
            {allCampgrounds ? (
              <>
                <div className="d-flex flex-column col-10 offset-1 col-md-8 offset-md-"></div>

                <div className={`container d-flex flex-column mt-5 `}>
                  <h1 className={`text-center my-4 `}>All Campgrounds:</h1>
                  <div className="container d-flex mb-3 flex-wrap align-items-start justify-content-center gap-4">
                    {allCampgrounds.length > 0 ? (
                      allCampgrounds.map((campground) => (
                        <CampgroundCard
                          key={campground._id}
                          campground={campground}
                        />
                      ))
                    ) : (
                      <p>No campgrounds available :(</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p>Loading Campgrounds...</p>
            )}
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
