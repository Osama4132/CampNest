import express from "express";
import {
  createBooking,
  createStripe,
  fetchFutureBookingsByCampgroundId,
  fetchPastBookingsByCampgroundId,
} from "../controllers/bookings.ts";
import { validateBooking } from "../repos/schemas/bookings.ts";

const router = express.Router();

router.post("/success", createBooking);

router.post("/:id/stripe", validateBooking, createStripe);

router.get("/:campground/future", fetchFutureBookingsByCampgroundId);

router.get("/:campground/past", fetchPastBookingsByCampgroundId);

export default router;
