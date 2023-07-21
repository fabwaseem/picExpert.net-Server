import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

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

const analyticsSchema = mongoose.Schema({
  totalImagesResized: Number,
  totalSizeOfResizedImages: Number,
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

app.post("/analytics", async (req, res) => {
  let { totalImagesResized, totalSizeOfResizedImages } = req.body;
  if (!totalImagesResized || !totalSizeOfResizedImages)
    return res.status(400).json({ message: "Invalid data" });
  totalImagesResized = parseInt(totalImagesResized);
  totalSizeOfResizedImages = parseInt(totalSizeOfResizedImages);
  const analytics = new Analytics({
    totalImagesResized,
    totalSizeOfResizedImages,
  });

  try {
    const existingAnalytics = await Analytics.findOne();
    if (existingAnalytics) {
      existingAnalytics.totalImagesResized += totalImagesResized;
      existingAnalytics.totalSizeOfResizedImages += totalSizeOfResizedImages;
      console.log(existingAnalytics);
      await existingAnalytics.save();
      return res
        .status(200)
        .json({ message: "Analytics updated successfully" });
    }
    await analytics.save();
    return res.status(200).json({ message: "Analytics created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/analytics", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    if (!analytics)
      return res.status(404).json({ message: "Analytics not found" });
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello to picExpert API");
});