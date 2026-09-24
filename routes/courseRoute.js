const express = require("express");
const { createCourseController, allCourseController, singleCourseController, singleCourseUpdateController, singlCourseDeleteController } = require("../controllers/courseController");

const router = express.Router();

router.post("/courses", createCourseController);
router.get("/courses", allCourseController);
router.get("/courses/:id", singleCourseController);
router.patch("/courses/:id", singleCourseUpdateController);
router.delete("/courses/:id", singlCourseDeleteController);

module.exports = router;
