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
  totalUsers: Number,
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
    totalUsers: 1,
  });

  try {
    const existingAnalytics = await Analytics.findOne();
    if (existingAnalytics) {
      existingAnalytics.totalImagesResized += totalImagesResized;
      existingAnalytics.totalSizeOfResizedImages += totalSizeOfResizedImages;
      existingAnalytics.totalUsers += 1;
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

const contactSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  // Validate that required fields are provided
  if (!firstName || !lastName || !email || !message) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }

  const contact = new Contact({
    firstName,
    lastName,
    email,
    phone,
    message,
  });

  try {
    await contact.save();
    return res
      .status(200)
      .json({ message: "Contact form data saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello to picExpert API");
});
