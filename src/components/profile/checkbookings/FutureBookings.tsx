import moment from "moment";
import styles from "../../../styles/FutureBookings.module.css";

export default function FutureBookings({
  futureBookingsState,
  setFutureBookingsState,
  switchForms,
  campgrounds,
  fetchPastBookingsByCampground,
  campgroundId,
}) {
  return (
    
    <>
    {console.log("Campgrounds Future:", campgrounds)}
      {futureBookingsState && (
        <div
          className={`min-vh-100 d-flex ${styles.fullpageWrapper}`}
          onClick={() => setFutureBookingsState(!futureBookingsState)}
        >
          <div
            className={`container d-flex justify-content-center align-items-center `}
          >
            <div
              className="col-12 col-xl-10 col-xxl-8 mt-3 "
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`card shadow ${styles.modalCard}`}>
                <div className={`card-body ${styles.cardForm}`}>
                  <div className="d-flex justify-content-evenly ">
                    <h4 className={`card-title ${styles.futureHeader} `}>
                      Future Bookings
                    </h4>
                    <h4
                      onClick={() => {
                        switchForms();
                        fetchPastBookingsByCampground(campgroundId);
                      }}
                      className={`card-title ${
                        futureBookingsState ? "" : "disabled"
                      } ${styles.pastHeader}`}
                    >
                      Past Bookings
                    </h4>
                  </div>
                  <div className="col-12 mt-4 ">
                    <div
                      className="d-flex flex-column justify-content-between overflow-y-auto"
                      style={{ maxHeight: "50vh" }}
                    >
                      {campgrounds.length === 0 ? (
                        <h2 className="text-center">No upcoming bookings</h2>
                      ) : (
                        campgrounds.map((campground) => (
                          <>
                            <div className="d-flex flex-row justify-content-between px-4 py-2 text-center fw-bold">
                              <div className="col">Username</div>
                              <div className="col">Start Date</div>
                              <div className="col">End Date</div>
                            </div>
                            <div className="d-flex flex-row align-items-center px-4 py-2 text-center">
                              <div
                                className="col "
                                style={{
                                  overflow: "auto",
                                  whiteSpace: "normal",
                                  maxHeight: "25vh",
                                }}
                              >
                                {campground.author.username}
                              </div>
                              <div
                                className="col "
                                style={{
                                  overflow: "auto",
                                  whiteSpace: "normal",
                                  maxHeight: "25vh",
                                }}
                              >
                                {moment(campground.bookings.startDate).format(
                                  "L"
                                )}
                              </div>
                              <div className="col">
                                {moment(campground.bookings.endDate).format(
                                  "L"
                                )}
                              </div>
                            </div>
                            <hr />
                          </>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
