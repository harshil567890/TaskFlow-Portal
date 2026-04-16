const mongoose = require("mongoose");

const connectDb = async (mongoUri) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
};

module.exports = connectDb;
