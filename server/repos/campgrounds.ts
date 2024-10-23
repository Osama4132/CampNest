import mongoose, { Schema } from "mongoose";
import { faker } from "@faker-js/faker";
import cities from "../../src/seeds/cities.ts";

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
  {
    title: String,
    images: [{ url: String, filename: String }],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number, Number],
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

const Campground = mongoose.model("Campground", campgroundSchema);

const seedAmount = 10;

//Placeholder random data for testing purposes
export async function seedCampgrounds() {
  await Campground.deleteMany({});
  Array(seedAmount)
    .fill(undefined)
    .map(async (_, i) => {
      const random = Math.floor(Math.random() * 1000);
      const randomPrice = Math.floor(Math.random() * 30) + 5;
      const newCampground = new Campground({
        title: `Title${i}`,
        location: `${cities[random].city}, ${cities[random].state}`,
        description: `${faker.company.catchPhraseDescriptor()}, ${faker.animal.bear()}`,
        images: [
          {
            url: `https://picsum.photos/900?random=${Math.random()}`,
            filename: "",
          },
          {
            url: `https://picsum.photos/900/1200?random=${Math.random()}`,
            filename: "",
          },
          {
            url: `https://picsum.photos/300/1500?random=${Math.random()}`,
            filename: "",
          },
          {
            url: `https://picsum.photos/1900/300?random=${Math.random()}`,
            filename: "",
          },
        ],
        geometry: {
          type: "Point",
          coordinates: [cities[random].longitude, cities[random].latitude],
        },
        price: randomPrice,
      });
      await newCampground.save();
    });
}

async function findAllCampgrounds() {
  const campgrounds = await Campground.find({});
  return campgrounds;
}

const campgroundModel = {
  findAllCampgrounds
}

export default campgroundModel 
