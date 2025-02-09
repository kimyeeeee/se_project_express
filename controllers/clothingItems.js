const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

const getItems = (req, res) => {
  console.log(req);
  console.log(req.body);

  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(SERVER_ERROR_STATUS_CODE).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { userId } = req.params;
  ClothingItem.findByIdAndDelete(userId)
    .orFail()
    .then((item) => res.status(200).send(item))
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
        .send({ message: err.message });
    });
};

const updateLike = (req, res, method) => {
  const {
    params: { id },
  } = req;
  ClothingItem.findByIdAndUpdate(
    id,
    { [method]: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: "Invalid item ID" });
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const likeItem = (req, res) => updateLike(req, res, "$addToSet");

const dislikeItem = (req, res) => updateLike(req, res, "$pull");

// const likeItem = (req, res) => {
//   console.log(req.params.itemId);
//   ClothingItem.findByIdAndUpdate(
//     console.log(req.params.itemId),
//     req.params.itemId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail(new Error("Item not found"))
//     .then((item) => {
//       res.setHeader("Content-Type", "application/json");
//       res.status(200).send({ data: item });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(SERVER_ERROR_STATUS_CODE).send({ message: "likeItem Error" });
//     });
// };

// const dislikeItem = (req, res) =>
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail(new Error("Item not found"))
//     .then((item) => {
//       res.setHeader("Content-Type", "application/json");
//       res.send({ data: item });
//     })
//     .catch((err) => {
//       res
//         .status(SERVER_ERROR_STATUS_CODE)
//         .send({ message: "dislikeItem Error" });
//     });

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
