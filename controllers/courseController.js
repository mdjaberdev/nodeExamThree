const mongoose = require("mongoose");

const Course = require("../models/courseSchema");
const Student = require("../models/studentSchema");

const createCourseController = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const allCourseController = async (req, res) => {
  try {
    const allCourse = await Course.find({});

    return res.status(200).json({
      success: true,
      count: allCourse.length,
      data: allCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const singleCourseController = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const singleCourseUpdateController = async (req, res) => {
  try {
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

    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater the 0",
      });
    }
    if (duration !== undefined && duration < 1) {
      return res.status(400).json({
        success: false,
        message: "Duration must be least 1 month",
      });
    }

    const singleCourseUpdate = await Course.findByIdAndUpdate(
      { _id: id },
      { title, price, category, duration },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Course updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const singlCourseDeleteController = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const getCourseStudents = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mongodb id error",
      });
    }

    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "course not found",
      });
    }
    const existingStudent = await Student.find({ enrolledCourses: id });

    return res.status(200).json({
      success: true,
      message: "students fetched successfully",
      count: existingStudent.length,
      data: existingStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

module.exports = {
  createCourseController,
  allCourseController,
  singleCourseController,
  singleCourseUpdateController,
  singlCourseDeleteController,
  getCourseStudents,
};
