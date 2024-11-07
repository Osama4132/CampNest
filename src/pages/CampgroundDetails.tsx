import "../styles/stars.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import Carousel from "../reactbootstrap/Carousel.tsx";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/maps.css";
import styles from "../styles/navbar.module.css";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUser } from "../contexts/UserProvider.tsx";

const mapboxEnv = import.meta.env.VITE_MAPBOX_TOKEN;

export default function CampgroundDetails() {
  const { user } = useUser();

  const [campground, setCampground] = useState(null);

  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { id } = useParams();
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.review) {
      errors.review = "Required";
    } else if (values.review.length <= 10) {
      errors.review = "Must be greater than 10 characters";
    }
    return errors;
  };

  const submitBooking = async () => {
    try {
      const response = await axios.post(`/api/booking/${id}`, {
        startDate: startDate,
        endDate: endDate,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReview = async (reviewid: string) => {
    try {
      const response = await axios.delete(
        `/api/campgrounds/${id}/review/${reviewid}`
      );
      getCampground();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCampground = async () => {
    const response = await axios.delete(`/api/campgrounds/${id}`);
    if (response.status === 200) {
      navigate("/campgrounds");
    }
  };

  const getCampground = useCallback(async () => {
    try {
      const response = await axios.get(`/api/campgrounds/${id}`);
      if (response.status !== 200) {
        navigate("/campgrounds");
      }
      setCampground(response.data);
    } catch (e) {
      console.error(e);
    }
  }, [id, navigate]);

  const createMapBox = useCallback(() => {
    if (campground && mapContainerRef.current) {
      const [lng, lat] = campground.geometry.coordinates;
      const newCoord = { lng, lat };

      mapboxgl.accessToken = mapboxEnv;
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: newCoord,
        zoom: 9,
      });
      mapRef.current.addControl(new mapboxgl.NavigationControl());

      new mapboxgl.Marker()
        .setLngLat(newCoord)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${campground.title}</h5><p>${campground.location}</p>`
          )
        )
        .addTo(mapRef.current);
    }
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [campground]);

  useEffect(() => {
    getCampground();
  }, [id, getCampground]);

  useEffect(() => {
    if (campground) {
      createMapBox();
    }
  }, [campground, createMapBox]);

  const formik = useFormik({
    initialValues: {
      review: "",
      rating: 1,
    },
    validate,
    onSubmit: async (values) => {
      await axios.post(`/api/campgrounds/${id}/review`, values);
      getCampground();
    },
  });

  return (
    <>
      <div>
        <Navbar styles={styles} />
        {campground && (
          <main style={{ marginTop: "4em" }}>
            <div className="row mx-2 my-2 mx-md-5 my-md-3 ">
              <div className=" col-lg-6 mt-3">
                <Carousel
                  images={campground.images}
                  showArrows={campground.images.length === 1 ? false : true}
                />
                <div className={` rounded `}>
                  <div className={`card`}>
                    <div className={`card-body `}>
                      <h5 className={`card-title fs-3`}>{campground.title}</h5>
                      <pre className={`card-text`}>
                        {campground.description}
                      </pre>
                    </div>
                    <ul className={`list-group list-group-flush `}>
                      <li className={`list-group-item `}>
                        Location: {campground.location}
                      </li>
                      <li className={`list-group-item  `}>
                        Created by: {campground.author.username}
                      </li>
                      <li className={`list-group-item  `}>
                        Price: ${campground.price}/night
                      </li>
                    </ul>
                    {user === campground.author.id && (
                      <div className="card-body p-3 d-flex gap-5 justify-content-center ">
                        <div className="d-flex">
                          <Link
                            to={`/campground/${id}/edit`}
                            className={`btn btn-info card-link `}
                          >
                            Edit Campground
                          </Link>
                        </div>
                        <div className="d-flex">
                          <button
                            className="btn btn-danger"
                            onClick={deleteCampground}
                          >
                            Delete Campground
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={` col-lg-6 d-flex flex-column mt-3`}>
                <div
                  id="map-container"
                  ref={mapContainerRef}
                  className="mb-3"
                />
                <div
                  className={`gap-3 p-3 col-lg-12 d-flex flex-column `}
                  style={{ backgroundColor: "#f5f5dccf" }}
                >
                  <div className={`row col-12 text-center `}>
                    <h2>Book Campground?</h2>
                  </div>
                  <div className="row">
                    <div className="col-6 d-flex flex-column align-items-center">
                      <h4 className={`p-0 mb-2 `}>Start date:</h4>
                      <DatePicker
                        showIcon
                        toggleCalendarOnIconClick
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                    </div>
                    <div className="col-6 d-flex flex-column align-items-center">
                      <h4 className={`p-0 mb-2 `}>End date:</h4>
                      <DatePicker
                        showIcon
                        toggleCalendarOnIconClick
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                      />
                    </div>
                    <div className="mt-5 d-flex col-12 justify-content-center">
                      <button onClick={submitBooking} className={`btn `}>
                        Book Campground
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={` p-3 mt-3`}
                style={{ backgroundColor: "#00000011" }}
              >
                <h2>Reviews:</h2>

                <form onSubmit={formik.handleSubmit} className="mb-3">
                  <div className="mb-3">
                    <fieldset className="starability-basic ">
                      <input
                        type="radio"
                        id="second-rate1"
                        name="rating"
                        value="1"
                        checked={formik.values.rating === 1}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate1" title="Terrible">
                        1 star
                      </label>

                      <input
                        type="radio"
                        id="second-rate2"
                        name="rating"
                        value="2"
                        checked={formik.values.rating === 2}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate2" title="Not good">
                        2 stars
                      </label>

                      <input
                        type="radio"
                        id="second-rate3"
                        name="rating"
                        value="3"
                        checked={formik.values.rating === 3}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate3" title="Average">
                        3 stars
                      </label>

                      <input
                        type="radio"
                        id="second-rate4"
                        name="rating"
                        value="4"
                        checked={formik.values.rating === 4}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate4" title="Very good">
                        4 stars
                      </label>

                      <input
                        type="radio"
                        id="second-rate5"
                        name="rating"
                        value="5"
                        checked={formik.values.rating === 5}
                        onChange={formik.handleChange}
                      />
                      <label htmlFor="second-rate5" title="Amazing">
                        5 stars
                      </label>
                    </fieldset>
                  </div>

                  <div className="mb-3">
                    <label className={`form-label fs-4 `} htmlFor="review">
                      Review
                    </label>
                    <textarea
                      className={`form-control  `}
                      rows={5}
                      name="review"
                      id="review"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.review}
                    />
                    {formik.touched.review && formik.errors.review ? (
                      <div style={{ color: "red" }}>{formik.errors.review}</div>
                    ) : null}
                    <button type="submit" className="btn btn-success mt-3">
                      Submit Review
                    </button>
                  </div>
                </form>
                {campground.reviews.length === 0 && (
                  <>
                    <h3 className={`text-center `}>No reviews</h3>
                    <h5 className={`text-center `}>Be the first to review!</h5>
                  </>
                )}

                {Object.keys(campground).length === 0 ||
                  campground.reviews.map((review) => (
                    <div className={`mb-3 card `} key={review._id}>
                      <div className={`card-body `}>
                        <h5>Rating: {review.rating}</h5>

                        <p
                          className="starability-result"
                          data-rating={review.rating}
                        >
                          Rated: 3
                        </p>
                        <pre className={` `}>{review.review}</pre>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className={`btn btn-sm btn-danger `}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </main>
        )}
        <Footer />
      </div>
    </>
  );
}
