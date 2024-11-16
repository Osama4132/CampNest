import { Request, Response } from "express";
import userModel, {fetchUserDataFromDB} from "../repos/users.ts";
import ExpressErrorGeneric from "../../src/util/ExpressErrorGeneric.ts";
import ExpressError from "../../src/util/ExpressError.ts";

export const createUser = async (req: Request, res: Response) => {
  console.log("reqsto:", req.body);
  const { username, email, id: userId } = req.body;

  userModel.createUser(userId, username, email);
  res.status(200).json({ message: "User registered" });
};

export const getUserId = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    const user = await userModel.getUserId(email);
    if (!user) throw new ExpressError("User not found", 401);
    res.status(200).json({ userId: user._id, email: user.email });
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};

export const fetchUserData = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    console.log("Id:", id)
    const userId = String(id);
    if (!userId) throw new ExpressError("User not found", 401);
    const userData = await fetchUserDataFromDB(userId);
    res.status(200).json(userData);
    return;
  } catch (e) {
    ExpressErrorGeneric(res, e);
  }
};
