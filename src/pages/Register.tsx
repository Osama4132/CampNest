import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import axios from "axios";

interface IFormikValues {
  username: string;
  password: string;
  email: string;
}

const validate = (values: IFormikValues) => {
  const errors = {} as Partial<IFormikValues>;
  if (!values.username) {
    errors.username = "Required";
  }
  //  else if (values.username.length >= 0) {
  //   errors.username = "Must be less than 10 characters";
  // }

  if (!values.password) {
    errors.password = "Required";
  }
  // else if (values.password.length >= 0) {
  //   errors.password = "Must be less than 10 characters";
  // }

  if (!values.email) {
    errors.email = "Required";
  }
  // else if (values.email.length >= 0) {
  //   errors.email = "Must be less than 30 characters";
  // }

  return errors;
};

export default function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const { email, password } = values;

        const response = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        console.log(response);
        if (response) {
          const newValues = { ...values, id: response.user.uid };
          const axiosResponse = await axios.post(
            "/api/user/register",
            newValues
          );
          navigate("/login");
        }
      } catch (e) {
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
              <h5 className="card-title">Register</h5>
              <form onSubmit={formik.handleSubmit}>
                <div className="my-3">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="form-control"
                    id="username"
                    type="text"
                    name="username"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div style={{ color: "red" }}>{formik.errors.username}</div>
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
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-control"
                    id="email"
                    type="email"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div style={{ color: "red" }}>{formik.errors.email}</div>
                  ) : null}
                </div>
                <div className="d-flex justify-content-between">
                  <Link to="/">
                    <p>Home page</p>
                  </Link>
                  <Link to="/Login">
                    <p>Already Registered?</p>
                  </Link>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    Register
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
