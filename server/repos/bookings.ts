import mongoose, { Types } from "mongoose";
import model from "./campgrounds.ts";
import ExpressError from "../../src/util/ExpressError.ts";

interface IBooking {
  _id: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  campground: string;
}

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  startDate: Date,
  endDate: Date,

  campground: {
    type: Schema.Types.ObjectId,
    ref: "Campground",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

export const Booking = mongoose.model("Booking", bookingSchema);

export async function createBooking(
  startDate: Date,
  endDate: Date,
  campgroundId: string
) {
  try {
    const newBooking = new Booking({
      startDate: startDate,
      endDate: endDate,
      campground: campgroundId,
    });

    await newBooking.save();
    updateCampground(newBooking, campgroundId);
  } catch (e) {
    throw new ExpressError(`Error in DB: ${e}`, 500);
  }
}

async function updateCampground(booking: any, campgroundId: string) {
  try {
    const campground = await model.findCampgroundById(campgroundId);
    if (campground) {
      campground.bookings.push(booking._id);
      await campground.save();
    }
  } catch (e) {
    throw new ExpressError(`Error in DB: ${e}`, 500);
  }
}

async function findBookingById(BookingId: string) {
  const booking = await Booking.findById(BookingId);
  return booking;
}

const BookingRepo = {
  createBooking,
  findBookingById,
};

export default BookingRepo;
