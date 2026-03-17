const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true
    },
    courseName: {
      type: String,
      required: true
    },
    instructor: {
      type: String,
      required: true
    },
    credits: {
      type: Number,
      required: true
    },
    schedule: {
      type: String,
      required: true
    },
    seatsAvailable: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);