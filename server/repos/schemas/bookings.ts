import { Request, Response, NextFunction } from "express";
import ExpressError from "../../../src/util/ExpressError.ts";
import ExpressErrorGeneric from "../../../src/util/ExpressErrorGeneric.ts";
import CampgroundsModel from "../campgrounds.ts";

export const validateBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: campgroundId } = req.params;
    const { startDate, endDate } = req.body;
    const currentDate = Date.parse(new Date().toDateString());

    const campground = await CampgroundsModel.findCampgroundById(campgroundId);

    const newStartDate = Date.parse(startDate);
    const newEndDate = Date.parse(endDate);

    if (newStartDate > newEndDate)
      throw new ExpressError("Start date can't be ahead of end date", 400);
    else if (newStartDate < +currentDate || newEndDate < +currentDate)
      throw new ExpressError(
        "Start date or end date can't be before your own date, C'mon bro",
        400
      );

    if (campground?.bookings) {
      campground.bookings.map((booking: any) => {
        const { startDate, endDate } = booking;
        const available = IsBookingAvailable(
          Date.parse(startDate),
          Date.parse(endDate),
          newStartDate,
          newEndDate
        );
        if (available === false)
          throw new ExpressError(
            "Booking overlapping with other bookings. Please change dates.",
            400
          );
      });
    }

    next();
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

function IsBookingAvailable(
  oldStartDate: number,
  oldEndDate: number,
  newStartDate: number,
  newEndDate: number
) {
  console.log("oldStartDate:", oldStartDate);
  console.log("oldEndDate:", oldEndDate);
  console.log("newStartDate:", newStartDate);
  console.log("newEndDate:", newEndDate);

  if (
    newStartDate === oldStartDate ||
    newStartDate === oldEndDate ||
    newEndDate === oldEndDate ||
    newEndDate === oldStartDate
  )
    return false;
  else if (newStartDate > oldStartDate) {
    if (newStartDate > oldEndDate) {
      return true;
    }
    return false;
  } else if (oldStartDate > newEndDate) {
    return true;
  } else if (newEndDate > oldStartDate) {
    return false;
  }
  return true;
}
