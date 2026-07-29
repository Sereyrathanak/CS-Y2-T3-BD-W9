const { Op, fn, col } = require("sequelize");
const { Student, Course, Score, Major } = require("../models");
const exercises = require("../services/exercises");

// GET /api/reports/student-performance
// Every student with their average score and number of courses taken.
async function studentPerformance(req, res) {
  try {
    const rows = await Score.findAll({
      attributes: [
        [col("student.id"), "student_id"],
        [fn("AVG", col("Score.score")), "average_score"],
        [fn("COUNT", col("Score.id")), "courses_taken"],
      ],
      include: [{ model: Student, as: "student", attributes: ["firstName", "lastName"] }],
      group: ["student.id", "student.firstName", "student.lastName"],
      raw: true,
    });

    const data = rows.map((r) => ({
      student_id: r.student_id,
      full_name: `${r["student.firstName"]} ${r["student.lastName"]}`,
      average_score: Number(parseFloat(r.average_score).toFixed(2)),
      courses_taken: Number(r.courses_taken),
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/reports/course-performance
// Every course with its average score and number of enrolled students.
async function coursePerformance(req, res) {
  try {
    const rows = await Score.findAll({
      attributes: [
        [col("course.id"), "course_id"],
        [fn("AVG", col("Score.score")), "average_score"],
        [fn("COUNT", col("Score.id")), "enrolled_count"],
      ],
      include: [{ model: Course, as: "course", attributes: ["name", "credit"] }],
      group: ["course.id", "course.name", "course.credit"],
      raw: true,
    });

    const data = rows.map((r) => ({
      course_id: r.course_id,
      course_name: r["course.name"],
      credit: r["course.credit"],
      average_score: Number(parseFloat(r.average_score).toFixed(2)),
      enrolled_count: Number(r.enrolled_count),
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/reports/major-performance
// Every major with its average score across all its courses.
async function majorPerformance(req, res) {
  try {
    const rows = await Score.findAll({
      attributes: [
        [col("course.major.id"), "major_id"],
        [fn("AVG", col("Score.score")), "average_score"],
      ],
      include: [
        {
          model: Course,
          as: "course",
          attributes: [],
          include: [{ model: Major, as: "major", attributes: ["name"] }],
        },
      ],
      group: ["course.major.id", "course.major.name"],
      raw: true,
    });

    const data = rows.map((r) => ({
      major_id: r.major_id,
      major_name: r["course.major.name"],
      average_score: Number(parseFloat(r.average_score).toFixed(2)),
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/reports/top-students?limit=5
// Highest average-score students, best first.
async function topStudents(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const rows = await Score.findAll({
      attributes: [
        [col("student.id"), "student_id"],
        [fn("AVG", col("Score.score")), "average_score"],
      ],
      include: [{ model: Student, as: "student", attributes: ["firstName", "lastName"] }],
      group: ["student.id", "student.firstName", "student.lastName"],
      order: [[fn("AVG", col("Score.score")), "DESC"]],
      limit,
      raw: true,
    });

    const data = rows.map((r) => ({
      student_id: r.student_id,
      full_name: `${r["student.firstName"]} ${r["student.lastName"]}`,
      average_score: Number(parseFloat(r.average_score).toFixed(2)),
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/reports/at-risk-students?threshold=60
// Students whose average score is below the threshold.
async function atRiskStudents(req, res) {
  try {
    const threshold = parseFloat(req.query.threshold) || 60;

    const rows = await Score.findAll({
      attributes: [
        [col("student.id"), "student_id"],
        [fn("AVG", col("Score.score")), "average_score"],
      ],
      include: [{ model: Student, as: "student", attributes: ["firstName", "lastName"] }],
      group: ["student.id", "student.firstName", "student.lastName"],
      raw: true,
    });

    // Filtered in JS rather than SQL HAVING for readability — with larger
    // datasets, replace with: having: sequelize.where(fn('AVG', col('Score.score')), Op.lt, threshold)
    const filtered = rows
      .map((r) => ({
        student_id: r.student_id,
        full_name: `${r["student.firstName"]} ${r["student.lastName"]}`,
        average_score: Number(parseFloat(r.average_score).toFixed(2)),
      }))
      .filter((r) => r.average_score < threshold);

    res.json({ success: true, threshold, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/reports/pass-rate?passingScore=60
// Overall percentage of scores that meet or exceed the passing score.
async function passRate(req, res) {
  try {
    const passingScore = parseFloat(req.query.passingScore) || 60;

    const total = await Score.count();
    const passed = await Score.count({
      where: { score: { [Op.gte]: passingScore } },
    });

    const rate = total === 0 ? 0 : Number(((passed / total) * 100).toFixed(2));

    res.json({
      success: true,
      passingScore,
      total,
      passed,
      failed: total - passed,
      passRate: rate,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  studentPerformance,
  coursePerformance,
  majorPerformance,
  topStudents,
  atRiskStudents,
  passRate,
};
