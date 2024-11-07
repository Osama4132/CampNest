import { useRef } from "react";
import { Link } from "react-router-dom";
import { doResetPassword } from "../firebase/auth";
export default function ForgotPassword() {
  const emailValue = useRef("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await doResetPassword(emailValue.current);
    console.log(response);
  };
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
              <h5 className="card-title">Forget Password</h5>
              <form onSubmit={handleSubmit}>
                <div className="my-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-control"
                    id="email"
                    type="text"
                    name="email"
                    onChange={(e) => (emailValue.current = e.target.value)}
                    autoFocus
                  />
                </div>
                <Link to="/Login">
                  <p>Go Back</p>
                </Link>
                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    Send Email
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
