const user = require("../models/user");
const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  INVALID_EMAIL_OR_PW,
} = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Invalid request" });
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(CONFLICT_STATUS_CODE)
        .send({ message: "User already exists" });
    }
    return bcrypt
      .hash(req.body.password, 10)
      .then((hash) =>
        User.create({
          name,
          avatar,
          email: req.body.email,
          password: hash,
        })
      )
      .then((user) => {
        res.status(201).send({
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          res.status(CONFLICT_STATUS_CODE).send({ message: err.message });
        } else if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST_STATUS_CODE)
            .send({ message: "An error has occurred on the server" });
        }
        return res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occured on the server" });
      });
  });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log("log in request received", email, "with pw", password);
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Invalid request" });
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      console.log("user object from the log in controller", user);
      //authentication successful if user in log
      if (!user) {
        return res
          .status(INVALID_EMAIL_OR_PW)
          .send({ messge: "Invalid email or password" });
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(401).send({ message: err.message });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const updatedUser = { name, avatar };

  User.findByIdAndUpdate(req.user._id, updatedUser, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  loginUser,
  updateUserProfile,
};
