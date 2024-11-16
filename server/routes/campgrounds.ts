import express from "express";
import {
  showAllCampgrounds,
  showCampgroundDetails,
  deleteCampground,
  createCampground,
  editCampground,
  showCampgroundEdit,
} from "../controllers/campgrounds.ts";
import multer from "multer";
import cloudinary from "../../src/cloudinary/cloudinary.ts";

const upload = multer({ storage: cloudinary.storage });

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "Message recieved!" });
});

router.get("/", showAllCampgrounds);

router.post("/", upload.array("images"), createCampground);

router.get("/:id", showCampgroundDetails);

router.delete("/:id", deleteCampground);

router.get("/:id/edit", showCampgroundEdit);

router.post("/:id/edit", upload.array("images"), editCampground);

export default router;
