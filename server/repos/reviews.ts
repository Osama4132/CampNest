import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  review: String,
  rating: Number,
});

const Review = mongoose.model("Review", reviewSchema);

export async function findReviewById(id: string) {
  const review = await Review.findById(id);

  return review;
}

export default Review;
