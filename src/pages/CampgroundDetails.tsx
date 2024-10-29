import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import Carousel from "../reactbootstrap/Carousel.tsx";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/maps.css"
import styles from "../styles/navbar.module.css";

const mapboxEnv = import.meta.env.VITE_MAPBOX_TOKEN;

export default function CampgroundDetails() {
  const [campground, setCampground] = useState(null);

  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

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

  return (
    <>
      <div>
        <Navbar styles={styles} />
        {campground && (
          <main>
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
                      <li className={`list-group-item  `}>Created by: N/A</li>
                      <li className={`list-group-item  `}>
                        Price: ${campground.price}/night
                      </li>
                    </ul>

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
                        <button className="btn btn-danger">
                          Delete Campground
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={` col-lg-6 d-flex flex-column mt-3`}>
                <div
                  id="map-container"
                  ref={mapContainerRef}
                  className="mb-3"
                />
              </div>
            </div>
          </main>
        )}
        <Footer />
      </div>
    </>
  );
}
