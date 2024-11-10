import express from "express";
import { createUser, getUserId } from "../controllers/users.ts";

const router = express.Router();

router.post("/register", createUser);

router.get("/id", getUserId);

export default router;
