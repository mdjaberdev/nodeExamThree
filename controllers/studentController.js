const mongoose = require("mongoose");

const Student = require("../models/studentSchema");
const Course = require("../models/courseSchema");

const createStudentController = async (req, res) => {
  try {
    const { name, email, phone, age, enrolledCourses } = req.body;

    if (!name || !email || !phone || !age) {
      return res.status(400).json({
        success: false,
        message: "Please fill the all feilds",
      });
    }
    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "18 + videos",
      });
    }

    const existingStudent = await Student.findOne({ email: email });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Email already exits",
      });
    }

    const student = new Student({
      name,
      email,
      phone,
      age,
      enrolledCourses: enrolledCourses || [],
    });

    await student.save();
    return res.status(201).json({
      success: true,
      message: "Create student",
      data: student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const allStudentsController = async (req, res) => {
  try {
    const allStudent = await Student.find({});

    return res.status(200).json({
      success: true,
      count: allStudent.length,
      data: allStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const singleStudentController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mongodb id error",
      });
    }

    const singleStudent =
      await Student.findById(id).populate("enrolledCourses");
    if (!singleStudent) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: singleStudent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const singleStudentUpdateController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mongodb id error",
      });
    }

    const existingEmail = await Student.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email alrady exits",
      });
    }
    if (req.body.age !== undefined && req.body.age < 18) {
      return res.status(400).json({
        success: false,
        message: "Age must be 18",
      });
    }
    const updateStudent = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Student updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const singlStudentDeleteController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mongodb id error",
      });
    }

    const existingStudent = await Student.findOne({ _id: id });

    if (!existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }
    if (existingStudent.enrolledCourses) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete student because they are enrolled courses",
      });
    }

    const deleteStudent = await Student.findByIdAndDelete({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Student deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

const enrollStudentController = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    if (
      !mongoose.Types.ObjectId.isValid(studentId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid mongodb id error",
      });
    }

    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!existingCourse.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Course not published",
      });
    }

    if (existingStudent.enrolledCourses.includes(courseId)) {
   return res.status(400).json({
     success: false,
     message: "Course already exits",
   });

    }
    existingStudent.enrolledCourses.push(courseId);

    await existingStudent.save();

    return res.status(200).json({
      success: true,
      message: "Enrolled course",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error : ${error.message}`,
    });
  }
};

module.exports = {
  createStudentController,
  allStudentsController,
  singleStudentController,
  singleStudentUpdateController,
  singlStudentDeleteController,
  enrollStudentController,
};
