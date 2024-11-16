import express from "express";
import { createUser, getUserId, fetchUserData } from "../controllers/users.ts";
import { fetchReviewsByUserId } from "../controllers/reviews.ts";
import { fetchCampgroundsByUserId } from "../controllers/campgrounds.ts";
import { fetchBookingsByUserId } from "../controllers/bookings.ts";

const router = express.Router();

router.get("/", fetchUserData);

router.post("/register", createUser);

router.get("/id", getUserId);

router.get("/reviews", fetchReviewsByUserId);

router.get("/campgrounds", fetchCampgroundsByUserId);

router.get("/bookings", fetchBookingsByUserId);

export default router;
