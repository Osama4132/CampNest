import { NextFunction, Request, Response } from "express";
import BookingRepo from "../repos/bookings.ts";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";
import Stripe from "stripe";
import { differenceInCalendarDays } from "date-fns";

const stripe = new Stripe(
  "sk_test_51QLaWKAcA3yWl5YihFqMmPrhCAgttWYREcaYCs6bL2qVxqrafnH34hdLA6yp7lqOlRfKZtfx3Umt2VtNRwq8aA6j00v5GWvANj"
);

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, campgroundId, author } = req.body;

    BookingRepo.createBooking(startDate, endDate, campgroundId, author);

    res.status(200).json({ message: "Booking created" });
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const createStripe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { price, startDate, endDate, campgroundId, author } = req.body;
    if (!author) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const differenceInDays = differenceInCalendarDays(endDate, startDate);
    console.log("Difference in days:", differenceInDays);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Your Product or Service",
            },
            unit_amount: price * 100 * (differenceInDays + 1),
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:5173/success?startDate=${startDate}&endDate=${endDate}&campgroundId=${campgroundId}&author=${author}`,
      cancel_url: `http://localhost:5173/campground/${campgroundId}`,
    });
    res.json({ url: session.url });
    next();
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
