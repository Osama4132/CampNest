import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.js";
import model from "../repos/campgrounds.ts";
import Review from "../repos/reviews.ts";
import { Request, Response } from "express";

export const createReview = async (req: Request, res: Response) => {
  try {
    const campground = await model.findCampgroundById(req.params.id);
    if (campground === null) {
      res.status(404).json({ message: "Campground not found." });
      return;
    }

    const { review, rating } = req.body;
    const newReview = new Review({
      review: review,
      rating: rating,
    });
    campground.reviews.push(newReview._id);
    await newReview.save();
    await campground.save();
    res.status(200).json({ message: "Review added sucessfully" });
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id, reviewid } = req.params;
    await model.deleteReviewInCampground(id, reviewid);
    await Review.findByIdAndDelete(reviewid);
    res.status(200).json({ message: "Review Deleted" });
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
