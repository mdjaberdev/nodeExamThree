const mongoose = require("mongoose");

const dbconnection = () => {
  return mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = dbconnection;
