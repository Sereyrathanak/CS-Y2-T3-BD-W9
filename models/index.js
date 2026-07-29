const sequelize = require("../config/database");
const Major = require("./major");
const Course = require("./course");
const Student = require("./student");
const Score = require("./score");

// Major 1---N Course
Major.hasMany(Course, { foreignKey: "majorId", as: "courses" });
Course.belongsTo(Major, { foreignKey: "majorId", as: "major" });

// Course 1---N Score
Course.hasMany(Score, { foreignKey: "courseId", as: "scores" });
Score.belongsTo(Course, { foreignKey: "courseId", as: "course" });

// Student 1---N Score
Student.hasMany(Score, { foreignKey: "studentId", as: "scores" });
Score.belongsTo(Student, { foreignKey: "studentId", as: "student" });

module.exports = { sequelize, Major, Course, Student, Score };
