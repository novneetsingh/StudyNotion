const mongoose = require("mongoose");

exports.dbconnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database connection established");
  } catch (error) {
    console.error("Connection issues with the database:", error);
    process.exit(1);
  }
};
