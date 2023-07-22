
import axios from 'axios';

export const fetchImageFromUrl = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const contentType = response.headers["content-type"];
    const buffer = Buffer.from(response.data, "base64");
    return { contentType, buffer };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
