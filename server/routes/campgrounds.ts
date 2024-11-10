import express from "express";
import {
  showAllCampgrounds,
  showCampgroundDetails,
  deleteCampground,
  createCampground,
} from "../controllers/campgrounds.ts";
import multer from "multer";
import cloudinary from "../../src/cloudinary/cloudinary.ts"

const upload = multer({ storage: cloudinary.storage });

const router = express.Router();
router.get("/test", (req, res) => {
  res.json({ message: "Message recieved!" });
});

router.get("/", showAllCampgrounds);

router.post(
  "/",

  upload.array("images"),
  createCampground,
  (req, res) => {
    console.log(req.body, "-----", req.files);
    res.status(200).send("Upload completed");
  }
);

router.get("/:id", showCampgroundDetails);

router.delete("/:id", deleteCampground);

export default router;
