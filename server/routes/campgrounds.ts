import express from "express";
import {
  showAllCampgrounds,
  showCampgroundDetails,
} from "../controllers/campgrounds.ts";

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "Message recieved!" });
});

router.get("/", showAllCampgrounds);

router.get("/:id", showCampgroundDetails);

export default router;
