require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
// const errorHandler = require("./middlewares/error-handler");
// const signupRoutes = require("./routes/signup");
const app = express();
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use("/", mainRouter);
// app.use("/", signupRoutes);

app.use(requestLogger);
app.use(mainRouter);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).send({ message: "An error occured on the server" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
