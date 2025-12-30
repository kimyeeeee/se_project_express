const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const { createItem } = require("../controllers/clothingItems");
const { createUser, getCurrentUser } = require("../controllers/users");

router.post(
  "/createItem",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      url: Joi.string().required().url(),
    }),
  }),
  createItem
);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().url(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

router.patch(
  "/authenticated",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  getCurrentUser
);

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).optional(),
    itemId: Joi.string().hex().length(24).optional(),
  }),
});

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});
