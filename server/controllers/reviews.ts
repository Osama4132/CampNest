import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.js";
import model from "../repos/campgrounds.ts";
import Review from "../repos/reviews.ts";
import { Request, Response } from "express";
import ExpressError from "../../src/util/ExpressError.ts";
import { modelFetchReviewsByUserId } from "../repos/reviews.ts";

export const createReview = async (req: Request, res: Response) => {
  try {
    const {id} = req.body
    const userId = String(id)
    if(!id){
      throw new ExpressError("User not logged in", 404)
    }
    const campground = await model.findCampgroundById(req.params.id);
    if (campground === null) {
      res.status(404).json({ message: "Campground not found." });
      return;
    }

    const { review, rating } = req.body;
    const newReview = new Review({
      review: review,
      rating: rating,
      author: userId,
      campground: req.params.id,
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

export const fetchReviewsByUserId = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const userId = String(id);

    if (!userId) {
      throw new ExpressError("User not found", 401);
    }
    const page = req.query.page ? Number(req.query.page) : 1;
    const productsPerPage = req.query.productsPerPage
      ? Number(req.query.productsPerPage)
      : 0;
    
    const campgrounds = await modelFetchReviewsByUserId(
      userId,
      page,
      productsPerPage
    );
    res.status(200).json(campgrounds);
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
