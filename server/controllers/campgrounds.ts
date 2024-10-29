import { Request, Response } from "express";
import model from "../repos/campgrounds.ts";

export const showAllCampgrounds = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const productsPerPage = req.query.productsPerPage
    ? Number(req.query.productsPerPage)
    : 0;

  const searchQuery = req.query.searchQuery
    ? String(req.query.searchQuery)
    : "";

  const campgrounds = await model.findAllCampgrounds(page, productsPerPage, searchQuery);
  if (!campgrounds) {
    res.status(404).json({ message: "Campgrounds not found" });
    return;
  }
  res.json(campgrounds);
};
