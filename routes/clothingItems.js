const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:userId", deleteItem);
router.put("/:userId", likeItem);
router.delete("/:userId", dislikeItem);

module.exports = router;
