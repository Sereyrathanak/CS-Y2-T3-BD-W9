const { Op, fn, col } = require("sequelize");
const { Student, Course, Score, Major } = require("../models");

/**
 * Exercise 1: High-performing students in a specific year
 * - academic year 2025-2026
 * - score >= 85
 * - belongs to active courses only
 */
async function highPerformingStudents() {
  const rows = await Score.findAll({
    where: {
      academicYear: "2025-2026",
      score: { [Op.gte]: 85 },
    },
    include: [
      {
        model: Student,
        as: "student",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Course,
        as: "course",
        attributes: ["id", "name"],
        where: { isActive: true },
      },
    ],
  });

  return rows.map((r) => ({
    studentId: r.student.id,
    fullName: `${r.student.firstName} ${r.student.lastName}`,
    course: r.course.name,
    score: r.score,
    academicYear: r.academicYear,
  }));
}

/**
 * Exercise 2: Multiple score conditions
 * score >= 60 AND score <= 90 AND academic_year = "2025-2026"
 * Uses Op.between
 */
async function scoresBetween() {
  return Score.findAll({
    where: {
      score: { [Op.between]: [60, 90] },
      academicYear: "2025-2026",
    },
  });
}

/**
 * Exercise 3: Search students by name and score
 * GET /api/reports/scores?keyword=dara&minScore=70
 * Search firstname, lastname, minimum score
 * Uses Op.or, Op.iLike, Op.gte
 */
async function searchStudentsByNameAndScore(keyword, minScore) {
  const rows = await Score.findAll({
    where: {
      score: { [Op.gte]: minScore },
    },
    include: [
      {
        model: Student,
        as: "student",
        attributes: ["id", "firstName", "lastName"],
        where: {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${keyword}%` } },
            { lastName: { [Op.iLike]: `%${keyword}%` } },
          ],
        },
      },
      { model: Course, as: "course", attributes: ["id", "name"] },
    ],
  });

  return rows.map((r) => ({
    studentId: r.student.id,
    fullName: `${r.student.firstName} ${r.student.lastName}`,
    course: r.course.name,
    score: r.score,
  }));
}

/**
 * Exercise 4: Full academic report
 * Student -> Score -> Course -> Major
 * Displays: Student, Score, Academic year, Course, Credit, Major
 */
async function fullAcademicReport() {
  const rows = await Score.findAll({
    include: [
      { model: Student, as: "student", attributes: ["id", "firstName", "lastName"] },
      {
        model: Course,
        as: "course",
        attributes: ["id", "name", "credit"],
        include: [{ model: Major, as: "major", attributes: ["id", "name"] }],
      },
    ],
  });

  return rows.map((r) => ({
    student: `${r.student.firstName} ${r.student.lastName}`,
    score: r.score,
    academicYear: r.academicYear,
    course: r.course.name,
    credit: r.course.credit,
    major: r.course.major.name,
  }));
}

/**
 * Exercise 5: Average score for each student
 * Returns student_id, full_name, average_score
 * Uses sequelize.fn("AVG", ...) + group
 */
async function averageScorePerStudent() {
  const rows = await Score.findAll({
    attributes: [
      [col("student.id"), "student_id"],
      [fn("AVG", col("Score.score")), "average_score"],
    ],
    include: [
      {
        model: Student,
        as: "student",
        attributes: ["firstName", "lastName"],
      },
    ],
    group: ["student.id", "student.firstName", "student.lastName"],
    raw: true,
  });

  return rows.map((r) => ({
    student_id: r.student_id,
    full_name: `${r["student.firstName"]} ${r["student.lastName"]}`,
    average_score: Number(parseFloat(r.average_score).toFixed(2)),
  }));
}

module.exports = {
  highPerformingStudents,
  scoresBetween,
  searchStudentsByNameAndScore,
  fullAcademicReport,
  averageScorePerStudent,
};
