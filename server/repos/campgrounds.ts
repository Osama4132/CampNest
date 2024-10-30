import mongoose, { Schema } from "mongoose";
import { faker } from "@faker-js/faker";
import cities from "../../src/seeds/cities.ts";
import ExpressError from "../../src/util/ExpressError.ts";

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

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href=# id="navigate-link" data-id=${this._id}>${this.title}</a></strong>`;
});

const Campground = mongoose.model("Campground", campgroundSchema);

const seedAmount = 100;

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

//If no produtsPerPage is provided, return all campgrounds
async function findAllCampgrounds(
  page: number = 1,
  productsPerPage: number = 0,
  searchQuery: string = ""
) {
  const query: {
    $or?: Array<{ title?: { $regex: RegExp }; location?: { $regex: RegExp } }>;
  } = {};

  if (searchQuery) {
    query.$or = [
      { title: { $regex: new RegExp(searchQuery, "i") } },
      { location: { $regex: new RegExp(searchQuery, "i") } },
    ];
  }

  const campgrounds = await Campground.find(query)
    .skip((page - 1) * productsPerPage)
    .limit(productsPerPage);

  const campgroundsCount = await Campground.find(query).countDocuments();
  const queryData = { campgrounds: campgrounds, count: campgroundsCount };
  return queryData;
}

async function findCampgroundById(id: string) {
  try {
    const campground = await Campground.findById(id);
    return campground;
  } catch (e) {
    throw new ExpressError(`Database Error: ${e}`, 404);
  }
}

const campgroundModel = {
  findAllCampgrounds,
  findCampgroundById,
};

export default campgroundModel;
