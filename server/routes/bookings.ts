import express from "express";
import { createBooking, createStripe } from "../controllers/bookings.ts";
import { validateBooking } from "../repos/schemas/bookings.ts";

const router = express.Router();

router.post("/:id/stripe", validateBooking, createStripe);

router.post("/success", createBooking)

export default router;
