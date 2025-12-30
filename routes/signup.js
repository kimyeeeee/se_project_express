// const router = require("express").Router();
// const { celebrate, Joi } = require("celebrate");
// const { createUser } = require("../controllers/users");
// router.post(
//   "/signup",
//   celebrate({
//     body: Joi.object().keys({
//       email: Joi.string().required().email(),
//       password: Joi.string().required().min(8),
//       name: Joi.string().required().min(2).max(30),
//       age: Joi.number().integer().required().min(18),
//       about: Joi.string().min(2).max(30),
//     }),
//   }),
//   createUser
// );
