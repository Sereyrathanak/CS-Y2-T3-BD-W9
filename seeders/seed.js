const { sequelize, Major, Course, Student, Score } = require("../models");

async function seed() {
  await sequelize.sync({ force: true });

  const majors = await Major.bulkCreate([
    { name: "Computer Science" },
    { name: "Business Administration" },
    { name: "Mathematics" },
  ]);

  const courses = await Course.bulkCreate([
    { name: "Database Systems", credit: 4, isActive: true, majorId: majors[0].id },
    { name: "Web Development", credit: 3, isActive: true, majorId: majors[0].id },
    { name: "Marketing Principles", credit: 3, isActive: true, majorId: majors[1].id },
    { name: "Discrete Mathematics", credit: 4, isActive: false, majorId: majors[2].id }, // inactive on purpose
  ]);

  const students = await Student.bulkCreate([
    { firstName: "Dara", lastName: "Sok", email: "dara.sok@example.com" },
    { firstName: "Sophea", lastName: "Chan", email: "sophea.chan@example.com" },
    { firstName: "Ratana", lastName: "Kim", email: "ratana.kim@example.com" },
    { firstName: "Dara", lastName: "Vann", email: "dara.vann@example.com" },
    { firstName: "Bopha", lastName: "Long", email: "bopha.long@example.com" },
  ]);

  await Score.bulkCreate([
    { studentId: students[0].id, courseId: courses[0].id, score: 92, academicYear: "2025-2026" },
    { studentId: students[0].id, courseId: courses[1].id, score: 76, academicYear: "2025-2026" },
    { studentId: students[0].id, courseId: courses[2].id, score: 88, academicYear: "2024-2025" },
    { studentId: students[1].id, courseId: courses[0].id, score: 65, academicYear: "2025-2026" },
    { studentId: students[1].id, courseId: courses[2].id, score: 90, academicYear: "2025-2026" },
    { studentId: students[2].id, courseId: courses[1].id, score: 55, academicYear: "2025-2026" },
    { studentId: students[2].id, courseId: courses[3].id, score: 95, academicYear: "2025-2026" }, 
    { studentId: students[3].id, courseId: courses[0].id, score: 85, academicYear: "2025-2026" },
    { studentId: students[3].id, courseId: courses[2].id, score: 40, academicYear: "2025-2026" },
    { studentId: students[4].id, courseId: courses[1].id, score: 88, academicYear: "2025-2026" },
  ]);

  console.log("Seed complete:", {
    majors: majors.length,
    courses: courses.length,
    students: students.length,
  });
  await sequelize.close();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
