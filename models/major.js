const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database");

class Major extends Model {}

Major.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Major",
    tableName: "majors",
    timestamps: true,
  }
);

module.exports = Major;
