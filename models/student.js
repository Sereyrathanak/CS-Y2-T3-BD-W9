const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Student extends Model {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: true,
  }
);

module.exports = Student;
