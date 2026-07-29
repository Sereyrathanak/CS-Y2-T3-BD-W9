require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
app.use(express.json());

app.use("/api/reports", reportRoutes);

app.use((err, req, res, next)=>{
  console.error(err);
  res.status(500).json({success:false,message:err.message || "Internal Server Error"});
});

app.get("/", (req, res) => {
  res.json({ message: "Academic Performance API is running." });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
  } catch (err) {
    console.error("Could not connect to the database:", err.message);
  }
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

start();
