import express from "express";
import { showAllCampgrounds } from "../controllers/campgrounds.ts";


const router = express.Router();
router.get("/test", (req, res) => {
    res.json({message: "Message recieved!"})
});

router.get("/", showAllCampgrounds)

export default router