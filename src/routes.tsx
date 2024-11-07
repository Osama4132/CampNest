import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { createBrowserRouter } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import HomePage from "./pages/Homepage";
import Newcampground from "./pages/Newcampground";
import Campgrounds from "./pages/Campgrounds";
import CampgroundDetails from "./pages/CampgroundDetails";
import ForgotPassword from "./pages/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "register", element: <Register /> },
  { path: "login", element: <Login /> },
  { path: "/newcampground", element: <Newcampground /> },

  {
    path: "campgrounds",
    element: <Campgrounds />,
  },
  {
    path: "campground/:id",
    element: <CampgroundDetails />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
]);

export default router;
