const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  SERVER_ERROR_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
} = require("../utils/errors");

const getItems = (req, res) => {
  console.log(req);
  console.log(req.body);

  ClothingItem.find({})
    .then((items) => {
      console.log("Items in DB", items);
      res.send(items);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error has occurred on the server" });
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
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  const { _id: userID } = req.user;

  if (!itemId) {
    return res
      .status(NOT_FOUND_STATUS_CODE)
      .send({ message: "Item ID is required." });
  }
  ClothingItem.findOne({ _id: itemId })
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userID) {
        return res
          .status(FORBIDDEN_STATUS_CODE)
          .send({ message: "You are not the owner of this item" });
      }
      return ClothingItem.deleteOne({ _id: itemId, owner: userID }).then(() => {
        console.log(`Item ${itemId} has been successfully deleted.`);
        res.status(200).send({ message: `Item ${itemId} has been deleted.` });
      });
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

const updateLike = (req, res, method) => {
  const {
    params: { itemId },
  } = req;
  console.log(itemId);
  ClothingItem.findByIdAndUpdate(
    itemId,
    { [method]: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      } else if (err.statusCode === NOT_FOUND_STATUS_CODE) {
        res.status(NOT_FOUND_STATUS_CODE).send({ message: err.message });
      } else {
        res
          .status(SERVER_ERROR_STATUS_CODE)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const likeItem = (req, res) => updateLike(req, res, "$addToSet");

const dislikeItem = (req, res) => updateLike(req, res, "$pull");

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
