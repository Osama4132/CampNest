import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CampgroundCard from "../components/CampgroundCard";
import styles from "../styles/navbar.module.css";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import ClusterMap from "../components/Clustermap";

export default function Newcampground() {
  const [paginatedCampgrounds, setPaginatedCampgrounds] = useState(null);
  const [allCampgrounds, setAllCampgrounds] = useState("");
  const [isloading, setIsLoading] = useState(true);

  const [pageCount, setPageCount] = useState(1);

  const [, setSearchParams] = useSearchParams();

  const productsPerPage = 16;

  const fetchpaginatedCampgrounds = async () => {
    const info = await axios.get(
      `/api/campgrounds?page=${pageCount}&productsPerPage=${productsPerPage}`
    );
    setPaginatedCampgrounds(info.data);
    setIsLoading(false);
  };

  const setPageNumInURL = useCallback(() => {
    setSearchParams({ page: `${pageCount}` });
  }, [pageCount, setSearchParams]);

  const onPageChange = (num: number) => {
    setPageCount(num);
  };

  const fetchAllCampgrounds = useCallback(async () => {
    try {
      const info = await axios.get(`/api/campgrounds`);
      setAllCampgrounds(info.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    setPageNumInURL();
    fetchpaginatedCampgrounds();
    fetchAllCampgrounds();
  }, [setPageNumInURL]);
  return (
    <>
      {isloading === true ? (
        <h1>Loading campgrounds...</h1>
      ) : (
        <div className="vh-min-100">
          <Navbar styles={styles} />
          <main className={`mt-3 `}>
            {paginatedCampgrounds && allCampgrounds ? (
              <>
                <div className="d-flex flex-column col-10 offset-1">
                  <ClusterMap
                    campgrounds={allCampgrounds.campgrounds}
                  ></ClusterMap>
                  <div className={`container d-flex flex-column mt-5 `}>
                    <h1 className={`text-center my-4 `}>All Campgrounds:</h1>
                    <div className="container d-flex mb-3 flex-wrap align-items-start justify-content-center gap-4">
                      {paginatedCampgrounds.campgrounds.length > 0 ? (
                        paginatedCampgrounds.campgrounds.map((campground) => (
                          <CampgroundCard
                            key={campground._id}
                            campground={campground}
                          />
                        ))
                      ) : (
                        <p>No campgrounds available</p>
                      )}
                    </div>
                  </div>
                  {Object.keys(paginatedCampgrounds).length === 0 || (
                    <Pagination
                      onPageChange={onPageChange}
                      currentPageCount={pageCount}
                      campgroundsCount={paginatedCampgrounds.count}
                      productsPerPage={productsPerPage}
                    />
                  )}
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
