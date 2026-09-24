require("node:dns").setServers(["1.1.1.1", "8.8.8.8"])
require("dotenv").config();
const express = require("express");
const dbconnection = require("./config/dbConnection");
const app = express();
const studentRouter = require("./routes/studentRoute")
const coursesRouter = require("./routes/courseRoute");

app.use(express.json());
dbconnection();

app.use("/api/v1/students", studentRouter);
app.use("/api/v1/courses", coursesRouter);

const port = process.env.DB_PORT || 8000;

app.listen(port, () => {
  console.log(`Server is connected ${port}`);
});
