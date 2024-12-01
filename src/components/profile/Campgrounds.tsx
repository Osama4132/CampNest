import { Link } from "react-router-dom";

export default function Campgrounds({
  campground,
  checkBookingsToggle,
  fetchBookingsByCampground,
  setSelectedCampgroundID,
}) {
  console.log(campground);
  return (
    <>
      <div className="container d-flex flex-wrap my-5">
        <div className="card flex-row d-flex col-12 p-3 flex-wrap">
          <div className="col-lg-3 col-12">
            <Link to={`/campground/${campground._id}`}>
              <img
                className="w-100 rounded"
                style={{
                  objectFit: "fill",
                  maxHeight: "30vh",
                  minHeight: "30vh",
                }}
                src={
                  campground.images.length !== 0
                    ? campground.images[0].url
                    : "https://i.pinimg.com/736x/d6/22/4b/d6224b4bfff79ecc55a028c969d4c8e3.jpg"
                }
              ></img>
            </Link>
          </div>
          <div className="col-12 col-lg-9 my-3 mt-lg-0 flex-wrap">
            <div
              className={`d-flex flex-column justify-content-between  `}
              style={{ minHeight: "30vh" }}
            >
              <div
                className={`flex-column d-flex justify-content-evenly`}
                style={{ minHeight: "20vh", overflowX: "auto" }}
              >
                <div className="d-flex flex-row justify-content-between px-4 py-2 text-center fw-bold">
                  <div className="col-4 col-lg fs-6">Title</div>
                  <div className="col-4 col-lg fs-6">Location</div>
                  <div className="col-4 col-lg fs-6">Reviews</div>
                  <div className="col-4 col-lg fs-6">Average Rating</div>
                  <div className="col-4 col-lg fs-6">Upcoming Bookings</div>
                </div>
                <div className="d-flex flex-row align-items-center px-4 py-2 text-center">
                  <div
                    className="col-4 col-lg fs-6"
                    style={{
                      overflow: "auto",
                      whiteSpace: "normal",
                      maxHeight: "16vh",
                    }}
                  >
                    {campground.title}
                  </div>
                  <div
                    className="col-4 col-lg fs-6"
                    style={{
                      overflow: "auto",
                      whiteSpace: "normal",
                      maxHeight: "16vh",
                    }}
                  >
                    {campground.location}
                  </div>
                  <div className="col-4 col-lg fs-4">
                    {campground.reviews.length}
                  </div>
                  <div className="col-4 col-lg fs-4">
                    {campground.avgReviewRating}
                  </div>
                  <div className="col-4 col-lg fs-4">
                    {campground.upcomingBookings === 1
                      ? 0
                      : campground.upcomingBookings === 2
                      ? 1
                      : 0}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-sm-row flex-column justify-content-evenly align-items-center gap-3 mt-3 mt-sm-0 gap-sm-0">
                <Link to={`/campground/${campground._id}/edit`}>
                  <button className="col btn btn-secondary">
                    Edit Campground
                  </button>
                </Link>
                <Link to={`/campground/${campground._id}`}>
                  <button className="col btn btn-success">
                    Check Campground
                  </button>
                </Link>
                <Link to="">
                  <button
                    onClick={() => {
                      checkBookingsToggle();
                      fetchBookingsByCampground(campground._id);
                      setSelectedCampgroundID(campground._id);
                    }}
                    className="col btn btn-primary"
                  >
                    Check Bookings
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
