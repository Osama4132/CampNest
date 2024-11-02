import express from "express";
import { createReview, deleteReview } from "../controllers/reviews.ts"
const router = express.Router({ mergeParams: true });

router.post("/",  createReview);

router.delete("/:reviewid", deleteReview);

export default router;
