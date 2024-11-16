import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  review: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  campground: {
    type: Schema.Types.ObjectId,
    ref: "Campground",
  },
});

const Review = mongoose.model("Review", reviewSchema);

export async function findReviewById(id: string) {
  const review = await Review.findById(id);

  return review;
}

export async function modelFetchReviewsByUserId(
  userId: string,
  page: number = 1,
  productsPerPage: number = 0
) {
  const reviews = await Review.find({ author: userId })
    .populate({ path: "campground", select: "_id images title" })
    .skip((page - 1) * productsPerPage)
    .limit(productsPerPage);
  const reviewsCount = await Review.find({
    author: userId,
  }).countDocuments();
  const queryData = { reviews: reviews, count: reviewsCount };
  return queryData;
}

export default Review;
