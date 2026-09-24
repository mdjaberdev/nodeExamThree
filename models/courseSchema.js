const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
