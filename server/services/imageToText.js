const Tesseract = require("tesseract.js");

exports.imageToText = async (image) => {
  try {
    const result = await Tesseract.recognize(image, "eng");

    if (result?.data?.text) {
      return `\nImage text: ${result.data.text}`;
    } else {
      return "\nNo text found in the attached image.";
    }
  } catch (error) {
    console.error("Image processing error:");
    return "\nNote: There was an error processing the attached image.";
  }
};
