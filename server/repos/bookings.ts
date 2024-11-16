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
    ref: "User",
  },
});

export const Booking = mongoose.model("Booking", bookingSchema);

export async function createBooking(
  startDate: Date,
  endDate: Date,
  campgroundId: string,
  author: string
) {
  try {
    const newBooking = new Booking({
      startDate: startDate,
      endDate: endDate,
      campground: campgroundId,
      author: author,
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

export async function fetchBookingsByUserId(
  userId: string,
  page: number = 1,
  productsPerPage: number = 0
) {
  try {
    const bookings = await Booking.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "campgrounds",
          localField: "campground",
          foreignField: "_id",
          as: "campground",
        },
      },
      {
        $unwind: {
          path: "$campground",
        },
      },
      {
        $match: {
          startDate: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            ),
          },
        },
      },
      {
        $sort: {
          startDate: 1,
        },
      },
    ])
      .skip((page - 1) * productsPerPage)
      .limit(productsPerPage);

    const bookingsCount = await Booking.find({
      author: userId,
    }).countDocuments();
    const queryData = { bookings: bookings, count: bookingsCount };
    return queryData;
  } catch (e) {
    throw new Error(`DB Error: ${e}`);
  }
}

const BookingRepo = {
  createBooking,
  findBookingById,
  fetchBookingsByUserId,
};

export default BookingRepo;
