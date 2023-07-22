import mongoose from "mongoose";

const analyticsSchema = mongoose.Schema({
  totalImagesResized: Number,
  totalSizeOfResizedImages: Number,
  totalUsers: Number,
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
