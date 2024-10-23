import { Link } from "react-router-dom";

export default function CampgroundCard({ campground }) {
  return (
    <>
      <div className="row d-flex flex-column col-12 col-sm-6 col-md-4 col-lg-3 ">
        <Link
          to={`/campground/${campground._id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="col-12 ">
            <img
              className={`w-100 h-auto rounded `}
              style={{
                objectFit: "fill",
                maxHeight: "30vh",
                minHeight: "30vh",
              }}
              src={campground.images[0]?.url}
              alt="Campground image"
            ></img>
          </div>
          <div className="col-md-12">
            <div className="card-body">
              <h5 className={`card-title mt-2 text-truncate`}>
                {campground.title}
              </h5>

              <p className={`card-text my-0 text-truncate $`}>
                Location: {campground.location}
              </p>

              <p className={`card-text my-0 `}>
                Price: ${campground.price}/night
              </p>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
