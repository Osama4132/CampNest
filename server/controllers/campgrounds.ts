import { Request, Response } from "express";
import model from "../repos/campgrounds.ts";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";
import redisClient from "../redis.ts";
import ExpressError from "../../src/util/ExpressError.ts";

export const showAllCampgrounds = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const productsPerPage = req.query.productsPerPage
    ? Number(req.query.productsPerPage)
    : 0;

  const searchQuery = req.query.searchQuery
    ? String(req.query.searchQuery)
    : "";
  if (searchQuery === "") {
    if (productsPerPage === 0) {
      const cacheSuccess = await cacheAllCampgrounds(res);
      if (cacheSuccess === true) return;
    }
    if (productsPerPage !== 0) {
      const cachceSuccess = await cachePaginatedCampgrounds(res, page);
      if (cachceSuccess === true) return;
    }
  }

  console.log("Calling repo..."); //This should only get called once for all campgrounds, and once per page
  const campgrounds = await model.findAllCampgrounds(
    page,
    productsPerPage,
    searchQuery
  );

  if (searchQuery === "") {
    if (productsPerPage === 0)
      await redisClient.set("allCampgrounds", JSON.stringify(campgrounds));
    if (productsPerPage !== 0)
      await redisClient.set(
        `paginatedCampgrounds/${page}`,
        JSON.stringify(campgrounds)
      );
  }

  if (!campgrounds) {
    res.status(404).json({ message: "Campgrounds not found" });
    return;
  }
  res.json(campgrounds);
};

export const createCampground = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    const { longitude, latitude } = req.body;
    const geometry = { coordinates: [+longitude, +latitude] };

    const { location, description, price, title } = req.body;

    const files = req.files as Express.Multer.File[];

    const campgroundImages = files.map((f: any) => ({
      url: f.path,
      filename: f.filename,
    }));
    await model.createCampground(
      geometry,
      location,
      description,
      price,
      title,
      campgroundImages,
      userId
    );
    clearCache();
    res.status(200).send("Campground created!");
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const showCampgroundDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const campground = await model.findCampgroundById(id);
    if (!campground) {
      res.status(404).json({ message: "Campground not found" });
      return;
    }
    res.json(campground);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const deleteCampground = async (req: Request, res: Response) => {
  try {
    const { user } = req.query;
    const userId = String(user);
    if (!userId) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    const { id } = req.params;
    await model.deleteCampgroundById(id, userId);
    clearCache();
    res.status(200).json({ message: `Campground ID ${id} Deleted.` });
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const showCampgroundEdit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!userId) {
      res.status(401).json({ message: "User is not logged in." });
      return;
    }
    const campground = await model.findCampgroundById(id);
    //@ts-ignore
    if (String(campground?.author?._id) !== userId) {
      throw new ExpressError("You are not the author of this campground", 403);
    }
    res.status(200).json(campground);
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const editCampground = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { location, description, price, title, userId } = req.body;
    if (!userId) {
      res.status(401).json({ message: "User is not logged in." });
      return;
    }
    let { deleteImages } = req.body;
    if (!Array.isArray(deleteImages) && deleteImages !== undefined)
      deleteImages = [deleteImages];

    const { longitude, latitude } = req.body;
    const geometry = { coordinates: [+longitude, +latitude] };

    const files = req.files as Express.Multer.File[];

    const campgroundImages = files.map((f: any) => ({
      url: f.path,
      filename: f.filename,
    }));
    await model.editCampground(
      geometry,
      id,
      location,
      description,
      price,
      title,
      campgroundImages,
      userId,
      deleteImages
    );
    clearCache();
    res.status(200).send("Campground Edited Sucessfully");
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

async function cacheAllCampgrounds(res: Response) {
  const cacheValue = await redisClient.get("allCampgrounds");
  if (cacheValue) {
    res.status(200).json(JSON.parse(cacheValue));
    return true;
  } else {
    return false;
  }
}

async function cachePaginatedCampgrounds(res: Response, pageNumber: number) {
  const cacheValue = await redisClient.get(
    `paginatedCampgrounds/${pageNumber}`
  );
  if (cacheValue) {
    res.status(200).json(JSON.parse(cacheValue));
    return true;
  } else {
    return false;
  }
}

export async function clearCache() {
  await redisClient.del("allCampgrounds");
  const pattern = "paginatedCampgrounds/*";
  let cursor = 0;

  do {
    const reply = await redisClient.scan(cursor, {
      MATCH: pattern,
      COUNT: 100,
    });
    cursor = reply.cursor;
    const keys = reply.keys;

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } while (cursor !== 0);
}
