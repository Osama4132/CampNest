import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useUser } from "../contexts/UserProvider";
import axios from "axios";
import { useToast } from "../contexts/ToastProvider";

interface IFormikValues {
  email: string;
  password: string;
}

const validate = (values: IFormikValues) => {
  const errors = {} as Partial<IFormikValues>;
  if (!values.email) {
    errors.email = "Required";
  }
  // else if (values.email.length >= 1) {
  //   errors.email = "Must be less than 1 characters";
  // }

  if (!values.password) {
    errors.password = "Required";
  }
  //  else if (values.password.length >= 6) {
  //   errors.password = "Must be greater than 6 characters";
  // }

  return errors;
};

export default function Register() {
  const navigate = useNavigate();
  const { getUser } = useUser();
  const showToast = useToast()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const { email, password } = values;
        const response = await doSignInWithEmailAndPassword(email, password);
        if (response) {
          const expressResponse = await axios.get("/api/user/id", {
            params: {email},
          });
          if (expressResponse) {
            console.log("express:", expressResponse)
            getUser(expressResponse.data.userId);
            showToast("Sucesfully logged in!", "green")
            navigate("/campgrounds");
          }
        }
      } catch (e) {
        showToast("error logging in", "red")
        throw new Error(`Error with the message: ${e}`);
      }
    },
  });

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center mt-5">
        <div className="col-8 col-lg-5 mt-3">
          <div className="card shadow">
            <img
              className="card-img-top"
              style={{ width: "auto", height: "300px" }}
              src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            ></img>
            <div className="card-body">
              <h5 className="card-title">Login</h5>
              <form onSubmit={formik.handleSubmit}>
                <div className="my-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-control"
                    id="email"
                    type="text"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    autoFocus
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div style={{ color: "red" }}>{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="form-control"
                    id="password"
                    type="password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div style={{ color: "red" }}>{formik.errors.password}</div>
                  ) : null}
                </div>
                <div className="d-flex justify-content-between">
                  <Link to="/">
                    <p className="text-end">Home page</p>
                  </Link>
                  <Link to="/ForgotPassword">
                    <p className="text-end">Forgot Password?</p>
                  </Link>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    Login
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
