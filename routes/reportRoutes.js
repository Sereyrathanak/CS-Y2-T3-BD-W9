const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const exerciseController = require("../controllers/exerciseController");

// --- Exercises 1-5 ---
router.get("/high-performers", exerciseController.highPerformers); // Ex.1
router.get("/scores-between", exerciseController.scoresBetween); // Ex.2
router.get("/scores", exerciseController.searchScores); // Ex.3
router.get("/full-academic-report", exerciseController.fullAcademicReport); // Ex.4
router.get("/average-scores", exerciseController.averageScores); // Ex.5

// --- Part 11: Academic Performance API ---
router.get("/student-performance", reportController.studentPerformance);
router.get("/course-performance", reportController.coursePerformance);
router.get("/major-performance", reportController.majorPerformance);
router.get("/top-students", reportController.topStudents); //
router.get("/at-risk-students", reportController.atRiskStudents); //
router.get("/pass-rate", reportController.passRate); //

module.exports = router;
