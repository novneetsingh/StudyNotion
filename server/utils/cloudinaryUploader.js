const cloudinary = require("cloudinary").v2;

exports.uploadToCloudinary = async (file, folder, height, quality) => {
  try {
    // Construct options for Cloudinary upload
    const options = { folder };

    // Add height option if provided
    if (height) {
      options.height = height;
    }

    // Add quality option if provided
    if (quality) {
      options.quality = quality;
    }

    // Set resource type to auto (determine from the file extension)
    options.resource_type = "auto";

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);

    // Return the Cloudinary upload result
    return result;
  } catch (error) {
    // If an error occurs during the upload process, handle it here
    console.error("Error uploading image to Cloudinary:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
};
