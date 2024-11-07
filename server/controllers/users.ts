import { Request, Response } from "express";
import userModel from "../repos/users.ts";

export const createUser = async (req: Request, res: Response) => {
  console.log("reqsto:", req.body);
  const { username, email, id: userId } = req.body;

  userModel.createUser(userId, username, email);
  res.status(200).json({ message: "User registered" });
};
