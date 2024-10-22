import { Request, Response } from "express";

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import campgroundRouter from "./routes/campgrounds.ts"

const app = express();
const PORT = process.env.PORT || 8080;

main()
  .then(() => console.log(`DB Connected sucessfully`))
  .catch((err) => console.log(`DB Failed to connect: ${err}`));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/CampNest");
}

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/campgrounds", campgroundRouter)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
