const express = require("express");
const { createStudentController, allStudentsController, singleStudentController, singleStudentUpdateController, singlStudentDeleteController, enrollStudentController } = require("../controllers/studentController");

const router = express.Router()

router.post("/students", createStudentController);
router.get("/students", allStudentsController);
router.get("/students/:id", singleStudentController);
router.patch("/students/:id", singleStudentUpdateController);
router.delete("/students/:id", singlStudentDeleteController);
router.post("/students/:studentId/enroll/:courseId", enrollStudentController);

module.exports = router;
