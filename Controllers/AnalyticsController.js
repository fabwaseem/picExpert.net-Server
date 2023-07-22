import Analytics from "../Models/AnalyticsModal.js";

export const postAnalytics = async (req, res) => {
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
};

export const getAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    if (!analytics)
      return res.status(404).json({ message: "Analytics not found" });
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
