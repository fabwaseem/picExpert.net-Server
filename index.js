import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import analyticsRoutes from "./Routes/AnalyticsRoute.js";
import contactRoutes from "./Routes/ContactRoute.js";
import axios from "axios";

const app = express();
dotenv.config();

const corsOptions = {
  origin: "https://picexpert.net/",
  credentials: true,
};

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port || 5000, () =>
      console.log(`Server running on http://localhost:${port}`)
    )
  )
  .catch((error) => console.log(error.message));

app.use("/analytics", analyticsRoutes);
app.use("/contact", contactRoutes);

app.get("/fetch-image", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];
    const buffer = Buffer.from(response.data, "base64");
    res.set("Content-Type", contentType);
    res.send(buffer);
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Failed to fetch image from the provided URL." });
  }
});

app.get("/", (req, res) => {
  res.send("Hello to picExpert API");
});
