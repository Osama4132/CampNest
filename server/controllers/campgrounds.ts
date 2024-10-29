import { Request, Response } from "express";
import model from "../repos/campgrounds.ts";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts"

export const showAllCampgrounds = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const productsPerPage = req.query.productsPerPage
    ? Number(req.query.productsPerPage)
    : 0;

  const campgrounds = await model.findAllCampgrounds(page, productsPerPage);
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
      return
    }
    res.json(campground);
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
