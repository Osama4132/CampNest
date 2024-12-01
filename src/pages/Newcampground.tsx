import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import bsCustomFileInput from "bs-custom-file-input";
import LocationPicker from "../components/LocationPicker";
import Navbar from "../components/Navbar";
import styles from "../styles/navbar.module.css";
import { useUser } from "../contexts/UserProvider";
import { useToast } from "../contexts/ToastProvider";

interface IFormikValues {
  title: string;
  location: string;
  price: number | string;
  description: string;
  images: Express.Multer.File[];
}

interface IErrorValues extends Omit<IFormikValues, "images"> {
  images: string;
}

const validate = (values: IFormikValues) => {
  const errors = {} as IErrorValues;
  if (!values.title) {
    errors.title = "Required";
  } else if (values.title.length >= 100) {
    errors.title = "Must be less than 100 characters";
  }

  if (!values.location) {
    errors.location = "Required";
  } else if (values.location.length <= 10) {
    errors.location = "Must be more than 10 characters";
  }

  if (!values.price) {
    errors.price = "Required";
  } else if (+values.price <= 0) {
    errors.price = "Must be greater than 0";
  }

  if (!values.images || values.images.length === 0) {
    errors.images = "Required";
  }

  if (!values.description) {
    errors.description = "Required";
  } else if (values.description.length <= 5) {
    errors.description = "Be a bit more descriptive!";
  }
  return errors;
};

export default function NewCampground() {
  const { user } = useUser();
  const showToast = useToast()
  const navigate = useNavigate();

  const [marker, setMarker] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      location: "",
      price: "",
      images: [],
      description: "",
    },
    validate,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("location", values.location);
      formData.append("price", values.price);
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i]);
      }
      formData.append("description", values.description);
      formData.append("longitude", String(marker.longitude));
      formData.append("latitude", String(marker.latitude));
      formData.append("userId", String(user))
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post("/api/campgrounds", formData);
      if (response.status === 200) {
        showToast("Campground created sucesfully!", "green")
        navigate("/campgrounds");
      }
    },
  });

  bsCustomFileInput.init();

  return (
    <>
      <Navbar styles={styles} />
      <div>
        <div className={`col-10 offset-1 col-md-8 offset-md-2 `}>
          <div className="mt-5 pt-3">
            <h1 className={`text-center `}>Create a new Campground</h1>
            <hr />
            <div className="card-body">
              <form
                onSubmit={formik.handleSubmit}
                encType="multipart/form-data"
              >
                <div className="mb-3">
                  <label
                    className={`form-label fw-medium fs-3 `}
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    className={`form-control `}
                    id="title"
                    type="text"
                    name="title"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.title}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div style={{ color: "red" }} className="fw-medium">
                      {formik.errors.title}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label
                    className={`form-label fw-medium fs-3 `}
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    className={`form-control `}
                    id="location"
                    type="text"
                    name="location"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.location}
                  />
                  {formik.touched.location && formik.errors.location ? (
                    <div style={{ color: "red" }} className="fw-medium">
                      {formik.errors.location}
                    </div>
                  ) : null}
                </div>
                <LocationPicker marker={marker} onMapClick={setMarker} />
                <label
                  className={`form-label mt-3 fw-medium fs-3 `}
                  htmlFor="price"
                >
                  Price
                </label>
                <div className="input-group">
                  <span className={`input-group-text `}>$</span>
                  <input
                    placeholder="0.00"
                    type="text"
                    className={`form-control `}
                    aria-label="Amount (to the nearest dollar)"
                    id="price"
                    name="price"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.price}
                  />
                </div>
                {formik.touched.price && formik.errors.price ? (
                  <div style={{ color: "red" }} className="fw-medium">
                    {formik.errors.price}
                  </div>
                ) : null}
                <div className="mb-3 mt-3">
                  <div className=" custom-file">
                    <label
                      htmlFor="images"
                      className={`form-label custom-file-label fw-medium fs-3 `}
                    >
                      {formik.values.images.length === 0
                        ? "Upload Images"
                        : null}
                    </label>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      className={`form-control `}
                      multiple
                      onChange={(event) => {
                        formik.setFieldValue("images", event.target.files);
                      }}
                    ></input>
                  </div>
                  {formik.touched.images && formik.errors.images ? (
                    <div style={{ color: "red" }} className="fw-medium">
                      {formik.errors.images}
                    </div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label
                    className={`form-label fw-medium fs-3 `}
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    className={`form-control`}
                    rows={6}
                    id="description"
                    name="description"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  ></textarea>
                  {formik.touched.description && formik.errors.description ? (
                    <div style={{ color: "red" }} className="fw-medium">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className={`btn btn-success mt-3 p-3 fs-5 fw-medium `}
                    type="submit"
                  >
                    Create Campground
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
