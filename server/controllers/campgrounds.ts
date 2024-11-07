import { Request, Response } from "express";
import model from "../repos/campgrounds.ts";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";
import redisClient from "../redis.ts";

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

  if(searchQuery === ""){
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
    const { id } = req.params;
    await model.deleteCampgroundById(id);
    res.status(200).json({ message: `Campground ID ${id} Deleted.` });
    return;
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
