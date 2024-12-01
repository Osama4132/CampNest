import { Link } from "react-router-dom";

export default function Reviews({ review }) {
  console.log(review)
  return (
    <>
      <div className="container d-flex flex-wrap my-5">
        <div className="card flex-row d-flex col-12 p-3 flex-wrap">
          <div className="col-lg-3 col-12">
            <Link to={`/campground/${review.campground._id}`}>
              <img
                className="w-100 rounded"
                style={{
                  objectFit: "fill",
                  maxHeight: "30vh",
                  minHeight: "30vh",
                }}
                src={
                  review.campground.images.length !== 0
                    ? review.campground.images[0].url
                    : "https://i.pinimg.com/736x/d6/22/4b/d6224b4bfff79ecc55a028c969d4c8e3.jpg"
                }
              ></img>
            </Link>
          </div>
          <div className="col-12 col-lg-9 my-3 mt-lg-0 flex-wrap">
            <div
              className="d-flex flex-column justify-content-between "
              style={{ minHeight: "30vh" }}
            >
              <div
                className={`flex-column d-flex justify-content-evenly `}
                style={{ minHeight: "20vh", overflowX: "auto" }}
              >
                <div className="d-flex flex-row  px-4 py-2 text-center fw-bold">
                  <div className="col-lg-3 col-4">Campground</div>
                  <div className="col-lg-2 col-4">Rating</div>
                  <div className="col-lg-7 col-8">Review</div>
                </div>
                <div className="d-flex flex-row px-4 py-2 align-items-center text-center">
                  <div
                    className="col-lg-3 col-4"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "normal",
                      maxHeight: "16vh",
                    }}
                  >
                    {review.campground.title}
                  </div>
                  <div
                    className="col-lg-2 col-4"
                    style={{
                      overflow: "hidden",
                    }}
                  >
                    {review.rating}
                  </div>
                  <div
                    className="col-lg-7 col-8"
                    style={{
                      overflow: "auto",
                      whiteSpace: "normal",
                      maxHeight: "16vh",
                    }}
                  >
                    {review.review}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row justify-content-evenly mt-3">
                <Link to={`/campground/${review.campground._id}`}>
                  <button className="btn btn-success">Check Campground</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
