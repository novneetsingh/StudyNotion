const Category = require("../models/Category");

// Function to create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required for the category",
      });
    }

    // Create the category
    const categoryDetails = await Category.create({
      name,
      description,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Function to fetch all categories
exports.showAllCategories = async (req, res) => {
  try {
    // Find all categories
    const allCategories = await Category.find();

    // Return success response with categories data
    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Function to fetch category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Get details of the selected category
    const selectedCategory = await Category.findById(categoryId).populate({
      path: "courses",
      populate: {
        path: "instructor",
        populate: { path: "additionalDetails" }, // Populate instructor's additional details
      },
    });

    // Handle if the selected category is not found
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Return only the selected category details
    return res.status(200).json({
      success: true,
      data: selectedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
