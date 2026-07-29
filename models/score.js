const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Score extends Model {}

Score.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    academicYear: {
      type: DataTypes.STRING, // e.g. "2025-2026"
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Score",
    tableName: "scores",
    timestamps: true,
  }
);

module.exports = Score;
