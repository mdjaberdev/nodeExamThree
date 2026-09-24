const mongoose = require("mongoose");

const Course = require("../models/courseSchema");

const createCourseController = async (req, res) => {
  const { title, price, category, duration } = req.body;
  if (!title || !price || !category || !duration) {
    return res.status(400).json({
      success: false,
      message: "Please fill the all feilds",
    });
  }

  if (price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Price must be greater then 0",
    });
  }

  if (duration < 1) {
    return res.status(400).json({
      success: false,
      message: "Duration must be at least 1 month",
    });
  }

  const existingCourse = await Course.findOne({ title, category });
  if (existingCourse) {
    return res.status(400).json({
      success: false,
      message: "This course already exits",
    });
  }

  const course = new Course({
    title,
    price,
    category,
    duration,
  });

  await course.save();

  return res.status(201).json({
    success: true,
    message: "Create course",
  });
};

const allCourseController = async (req, res) => {
  const allCourse = await Course.find({});

  return res.status(200).json({
    success: true,
    count: allCourse.length,
    data: allCourse,
  });
};

const singleCourseController = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid mongodb id error",
    });
  }
  const singleCourse = await Course.findById(id);
  if (!singleCourse) {
    return res.status(400).json({
      success: false,
      message: "Course not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: singleCourse,
  });
};

const singleCourseUpdateController = async (req, res) => {
  const { id } = req.params;
  const { title, price, category, duration } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid mongodb id error",
    });
  }

  const existingCourse = await Course.findOne({ title, category });
  if (existingCourse) {
    return res.status(400).json({
      success: false,
      message: "This course already exits",
    });
  }

  if (req.body.price !== undefined && req.body.price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Price must be greater the 0",
    });
  }
  if (req.body.duration !== undefined && req.body.duration < 1) {
    return res.status(400).json({
      success: false,
      message: "Duration must be least 1 month",
    });
  }

  const singleCourseUpdate = await Course.findByIdAndUpdate(
    { _id: id },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: "Course updated",
  });
};

const singlCourseDeleteController = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid mongodb id error",
    });
  }

  const existingCourse = await Course.findOne({ _id: id });

  if (!existingCourse) {
    return res.status(400).json({
      success: false,
      message: "Student not found",
    });
  }

  const deleteCourse = await Course.findByIdAndDelete({ _id: id });

  return res.status(200).json({
    success: true,
    message: "Course deleted",
  });
};

module.exports = {
  createCourseController,
  allCourseController,
  singleCourseController,
  singleCourseUpdateController,
  singlCourseDeleteController,
};
