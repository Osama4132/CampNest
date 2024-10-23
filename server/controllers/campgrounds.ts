import { Request, Response } from "express";
import model from "../repos/campgrounds.ts";

export const showAllCampgrounds = async (req: Request, res: Response) => {
  const campgrounds = await model.findAllCampgrounds();
  if (!campgrounds) {
    res.status(404).json({ message: "Campgrounds not found" });
    return;
  }
  res.json(campgrounds);
};
