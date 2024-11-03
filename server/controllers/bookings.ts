import { Request, Response } from "express";
import BookingRepo from "../repos/bookings.ts";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { id: campgroundId } = req.params;
    const { startDate, endDate } = req.body;

    BookingRepo.createBooking(startDate, endDate, campgroundId);

    res.status(200).json({ message: "Booking created" });
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
