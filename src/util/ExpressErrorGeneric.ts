import {Response} from "express"
import ExpressError from "./ExpressError.ts";

export default function ExpressErrorGeneric(res: Response, e: unknown) {
  if (e instanceof ExpressError) {
    return res.status(e.status).json({ message: e.message });
  } else {
    return res.status(500).json({ message: `Server error: ${e}` });
  }
}
