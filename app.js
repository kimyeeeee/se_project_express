const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { loginUser, createUser } = require("./controllers/users");
const { getItems, deleteItem } = require("./controllers/clothingItems");
const { auth } = require("./middlewares/auth");
const cors = require("cors");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: "67a1a932203adcb0938454fb",
//   };
//   next();
// });

app.post("/signin", loginUser);
app.post("/signup", createUser);
app.use(auth);
app.get("/", getItems);

// app.use("/signin", require("./routes/users"));
app.use(cors());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
